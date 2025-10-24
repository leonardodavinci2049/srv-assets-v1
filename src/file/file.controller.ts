import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { FileResponseDto, FileListResponseDto } from './dto/file-response.dto';
import { FindFileDto } from './dto/find-file.dto';
import { DeleteFileDto } from './dto/delete-file.dto';
import {
  EntityGalleryDto,
  EntityGalleryResponseDto,
} from './dto/entity-gallery.dto';
import {
  UpdatePrimaryImageDto,
  ReorderImagesDto,
} from './dto/update-primary-image.dto';
import { isAllowedMimeType } from './helpers/file-validation.helper';
import { ApiKeyGuard } from 'src/core/guards/api-key.guard';

type MulterFile = Express.Multer.File;

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getStatus() {
    return {
      name: 'SRV_ASSETS',
      status: 'online',
      version: '1.0.0',
      documentation: '/',
      timestamp: new Date().toISOString(),
      endpoints: {
        base: '/api',
        upload: '/api/file/v1/upload-file',
        list: '/api/file/v1/list-files',
        getOne: '/api/file/v1/find-file',
        delete: '/api/file/v1/delete-file',
        gallery: '/api/file/v1/entity-gallery',
        setPrimary: '/api/file/v1/set-primary-image',
        reorder: '/api/file/v1/reorder-images',
        note: 'All endpoints require x-api-key header',
      },
    };
  }

  @Post('v1/upload-file')
  @UseGuards(ApiKeyGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: MulterFile | undefined,
    @Body() uploadFileDto: UploadFileDto,
    @Req() req: Request,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // console.log('Uploaded file:', file.originalname, file.mimetype, file.size);
    // console.log('UploadFileDto:', uploadFileDto);
    // Validate MIME type
    const mimeType = file.mimetype;
    if (!mimeType || !isAllowedMimeType(mimeType)) {
      throw new BadRequestException(
        `File type ${mimeType || 'unknown'} is not allowed`,
      );
    }

    const ipAddress: string | undefined = req.ip || req.socket?.remoteAddress;
    const userAgent: string | undefined = req.headers['user-agent'];

    return await this.fileService.upload(
      file,
      uploadFileDto,
      ipAddress,
      userAgent,
    );
  }

  @Post('v1/list-files')
  @UseGuards(ApiKeyGuard)
  async listFiles(@Body() query: FileQueryDto): Promise<FileListResponseDto> {
    return await this.fileService.findAll(query);
  }

  @Post('v1/find-file')
  @UseGuards(ApiKeyGuard)
  async findOne(@Body() body: FindFileDto): Promise<FileResponseDto> {
    return await this.fileService.findOne(body.id);
  }

  @Post('v1/delete-file')
  @UseGuards(ApiKeyGuard)
  async deleteFile(
    @Body() body: DeleteFileDto,
    @Req() req: Request,
  ): Promise<{ success: boolean; message: string }> {
    const ipAddress: string | undefined = req.ip || req.socket?.remoteAddress;
    const userAgent: string | undefined = req.headers['user-agent'];

    return await this.fileService.delete(body.id, ipAddress, userAgent);
  }

  @Post('v1/entity-gallery')
  @UseGuards(ApiKeyGuard)
  async getEntityGallery(
    @Body() body: EntityGalleryDto,
  ): Promise<EntityGalleryResponseDto> {
    return await this.fileService.getEntityGallery(body);
  }

  @Post('v1/set-primary-image')
  @UseGuards(ApiKeyGuard)
  async setPrimaryImage(
    @Body() body: UpdatePrimaryImageDto,
    @Req() req: Request,
  ): Promise<{ success: boolean; message: string }> {
    const ipAddress: string | undefined = req.ip || req.socket?.remoteAddress;
    const userAgent: string | undefined = req.headers['user-agent'];

    return await this.fileService.setPrimaryImage(body, ipAddress, userAgent);
  }

  @Post('v1/reorder-images')
  @UseGuards(ApiKeyGuard)
  async reorderImages(
    @Body() body: ReorderImagesDto,
    @Req() req: Request,
  ): Promise<{ success: boolean; message: string }> {
    const ipAddress: string | undefined = req.ip || req.socket?.remoteAddress;
    const userAgent: string | undefined = req.headers['user-agent'];

    return await this.fileService.reorderImages(body, ipAddress, userAgent);
  }
}
