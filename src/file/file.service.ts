import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ImageService } from '../image/image.service';
import { UploadFileDto } from './dto/upload-file.dto';
import {
  FileResponseDto,
  FileListResponseDto,
  AssetVersionDto,
} from './dto/file-response.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { sanitizeFilename } from './helpers/file-naming.helper';
import {
  buildFilePath,
  getFullFilePath,
  buildPublicUrl,
  getDateParts,
} from './helpers/path-builder.helper';
import { determineFileType, isImage } from './helpers/file-validation.helper';
import { AssetStatus, FileType } from '../../generated/prisma';
import { envs } from '../core/config/envs';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly imageService: ImageService,
  ) {}

  /**
   * Upload and process file
   */
  async upload(
    file: Express.Multer.File,
    dto: UploadFileDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<FileResponseDto> {
    try {
      // Determine file type
      const fileType = determineFileType(file.mimetype);
      if (!fileType) {
        throw new BadRequestException('Invalid file type');
      }

      // Generate unique ID
      const fileId = uuidv4();

      // Sanitize filename
      const sanitizedName = sanitizeFilename(file.originalname);

      // Build paths
      const basePath = buildFilePath(fileType, fileId);
      const fullBasePath = getFullFilePath('.', basePath);

      // Create directory
      await this.storage.ensureDirectoryExists(fullBasePath);

      // Save original file
      const originalPath = getFullFilePath(fullBasePath, sanitizedName);
      await this.storage.moveFile(file.path, originalPath);

      // Create asset record
      await this.prisma.asset.create({
        data: {
          id: fileId,
          entityType: dto.entityType,
          entityId: dto.entityId,
          originalName: file.originalname,
          sanitizedName,
          fileType,
          mimeType: file.mimetype,
          fileSize: file.size,
          basePath,
          status: AssetStatus.PROCESSING,
          metadata: {
            description: dto.description,
            altText: dto.altText,
          },
        },
      });

      // Process image if applicable
      if (isImage(file.mimetype) && fileType === FileType.IMAGE) {
        await this.processImageVersions(fileId, originalPath, fullBasePath);
      } else {
        // For non-images, just create original version
        await this.createOriginalVersion(
          fileId,
          sanitizedName,
          basePath,
          file.size,
        );
      }

      // Add tags if provided
      if (dto.tags && dto.tags.length > 0) {
        await Promise.all(
          dto.tags.map((tag) =>
            this.prisma.assetTag.create({
              data: {
                assetId: fileId,
                tag: tag.trim().toLowerCase(),
              },
            }),
          ),
        );
      }

      // Update status to ACTIVE
      await this.prisma.asset.update({
        where: { id: fileId },
        data: { status: AssetStatus.ACTIVE },
      });

      // Log upload operation
      await this.prisma.assetLog.create({
        data: {
          assetId: fileId,
          operation: 'upload',
          ipAddress,
          userAgent,
          metadata: {
            fileSize: file.size,
            mimeType: file.mimetype,
          },
        },
      });

      this.logger.log(`File uploaded successfully: ${fileId}`);

      // Return response
      return await this.findOne(fileId);
    } catch (error) {
      this.logger.error(`Upload failed: ${error}`);
      throw error;
    }
  }

  /**
   * Process image and create versions
   */
  private async processImageVersions(
    assetId: string,
    originalPath: string,
    outputDir: string,
  ): Promise<void> {
    const processed = await this.imageService.processImage(
      originalPath,
      outputDir,
    );

    // Create version records
    const versions = [
      {
        assetId,
        versionType: 'original',
        fileName: 'original.jpg',
        filePath: processed.original.path,
        fileSize: processed.original.size,
        width: processed.original.width,
        height: processed.original.height,
        isProcessed: true,
      },
    ];

    if (processed.preview) {
      versions.push({
        assetId,
        versionType: 'preview',
        fileName: 'preview.jpg',
        filePath: processed.preview.path,
        fileSize: processed.preview.size,
        width: processed.preview.width,
        height: processed.preview.height,
        isProcessed: true,
      });
    }

    if (processed.thumbnail) {
      versions.push({
        assetId,
        versionType: 'thumbnail',
        fileName: 'thumbnail.jpg',
        filePath: processed.thumbnail.path,
        fileSize: processed.thumbnail.size,
        width: processed.thumbnail.width,
        height: processed.thumbnail.height,
        isProcessed: true,
      });
    }

    await this.prisma.assetVersion.createMany({
      data: versions,
    });
  }

  /**
   * Create original version for non-images
   */
  private async createOriginalVersion(
    assetId: string,
    fileName: string,
    filePath: string,
    fileSize: number,
  ): Promise<void> {
    await this.prisma.assetVersion.create({
      data: {
        assetId,
        versionType: 'original',
        fileName,
        filePath: getFullFilePath(filePath, fileName),
        fileSize,
        isProcessed: true,
      },
    });
  }

  /**
   * Find all assets with filters
   */
  async findAll(query: FileQueryDto): Promise<FileListResponseDto> {
    const {
      entityType,
      entityId,
      fileType,
      status,
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
      ...(fileType && { fileType }),
      status: status || AssetStatus.ACTIVE,
      deletedAt: null,
    };

    const [assets, total] = await Promise.all([
      this.prisma.asset.findMany({
        where,
        include: {
          versions: true,
          tags: true,
        },
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
      }),
      this.prisma.asset.count({ where }),
    ]);

    const data = assets.map((asset) => this.mapToResponseDto(asset));

    return {
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Find one asset by ID
   */
  async findOne(id: string): Promise<FileResponseDto> {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        versions: true,
        tags: true,
      },
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }

    return this.mapToResponseDto(asset);
  }

  /**
   * Soft delete asset
   */
  async delete(
    id: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ success: boolean; message: string }> {
    const asset = await this.prisma.asset.findUnique({ where: { id } });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }

    await this.prisma.asset.update({
      where: { id },
      data: {
        status: AssetStatus.DELETED,
        deletedAt: new Date(),
      },
    });

    // Log deletion
    await this.prisma.assetLog.create({
      data: {
        assetId: id,
        operation: 'delete',
        ipAddress,
        userAgent,
      },
    });

    this.logger.log(`Asset deleted (soft): ${id}`);

    return {
      success: true,
      message: 'Asset marked as deleted',
    };
  }

  /**
   * Map Prisma asset to response DTO
   */
  private mapToResponseDto(asset: any): FileResponseDto {
    const dateParts = getDateParts();

    const versions: AssetVersionDto[] = asset.versions.map((v: any) => ({
      versionType: v.versionType,
      fileName: v.fileName,
      url: buildPublicUrl(
        envs.APP_API_URL,
        asset.fileType,
        dateParts.year,
        dateParts.month,
        dateParts.day,
        asset.id,
        v.fileName,
      ),
      fileSize: v.fileSize,
      width: v.width,
      height: v.height,
    }));

    const urls: any = {};
    versions.forEach((v) => {
      urls[v.versionType] = v.url;
    });

    return {
      id: asset.id,
      entityType: asset.entityType,
      entityId: asset.entityId,
      originalName: asset.originalName,
      fileType: asset.fileType,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      status: asset.status,
      uploadedAt: asset.uploadedAt,
      tags: asset.tags.map((t: any) => t.tag),
      versions,
      urls,
    };
  }
}
