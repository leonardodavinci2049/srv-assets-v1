import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
import { IMAGE_PROCESSING } from '../core/config/upload.config';

export interface ProcessedImageVersion {
  path: string;
  width: number;
  height: number;
  size: number;
}

export interface ProcessedImage {
  original: ProcessedImageVersion;
  preview?: ProcessedImageVersion;
  medium?: ProcessedImageVersion;
  thumbnail?: ProcessedImageVersion;
}

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  /**
   * Process image and generate all versions (original, preview, thumbnail)
   */
  async processImage(
    inputPath: string,
    outputDir: string,
    baseFilename?: string,
  ): Promise<ProcessedImage> {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      const result: ProcessedImage = {
        original: await this.processOriginal(
          inputPath,
          outputDir,
          baseFilename,
        ),
      };

      // Generate preview if enabled
      if (IMAGE_PROCESSING.GENERATE_PREVIEW) {
        result.preview = await this.generatePreview(
          inputPath,
          outputDir,
          baseFilename,
        );
      }

      // Generate medium if enabled
      if (IMAGE_PROCESSING.GENERATE_MEDIUM) {
        result.medium = await this.generateMedium(
          inputPath,
          outputDir,
          baseFilename,
        );
      }

      // Generate thumbnail if enabled
      if (IMAGE_PROCESSING.GENERATE_THUMBNAIL) {
        result.thumbnail = await this.generateThumbnail(
          inputPath,
          outputDir,
          baseFilename,
        );
      }

      this.logger.log(`Image processed successfully: ${outputDir}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process image: ${error}`);
      throw error;
    }
  }

  /**
   * Process original image (copy and get metadata)
   */
  private async processOriginal(
    inputPath: string,
    outputDir: string,
    baseFilename?: string,
  ): Promise<ProcessedImageVersion> {
    const ext = path.extname(inputPath);
    const fileName = baseFilename
      ? `${baseFilename}-original${ext}`
      : `original${ext}`;
    const outputPath = path.join(outputDir, fileName);

    // Copy file instead of processing with sharp to preserve quality
    await fs.copyFile(inputPath, outputPath);

    // Get metadata for the record
    const metadata = await sharp(inputPath).metadata();
    const stats = await fs.stat(outputPath);

    return {
      path: outputPath,
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: stats.size,
    };
  }

  /**
   * Generate preview version (800x600, quality 90%)
   */
  private async generatePreview(
    inputPath: string,
    outputDir: string,
    baseFilename?: string,
  ): Promise<ProcessedImageVersion> {
    const metadata = await sharp(inputPath).metadata();
    const isPng = metadata.format === 'png';
    const ext = isPng ? '.png' : '.jpg';

    const fileName = baseFilename
      ? `${baseFilename}-preview${ext}`
      : `preview${ext}`;
    const outputPath = path.join(outputDir, fileName);

    let pipeline = sharp(inputPath).resize(
      IMAGE_PROCESSING.PREVIEW_WIDTH,
      IMAGE_PROCESSING.PREVIEW_HEIGHT,
      {
        fit: 'inside',
        withoutEnlargement: true,
      },
    );

    if (isPng) {
      pipeline = pipeline.png({ compressionLevel: 9 });
    } else {
      pipeline = pipeline.jpeg({
        quality: IMAGE_PROCESSING.COMPRESSION_QUALITY,
      });
    }

    await pipeline.toFile(outputPath);

    const outputMetadata = await sharp(outputPath).metadata();
    const stats = await fs.stat(outputPath);

    return {
      path: outputPath,
      width: outputMetadata.width || 0,
      height: outputMetadata.height || 0,
      size: stats.size,
    };
  }

  /**
   * Generate medium version (400x400, quality 90%, inside)
   */
  private async generateMedium(
    inputPath: string,
    outputDir: string,
    baseFilename?: string,
  ): Promise<ProcessedImageVersion> {
    const metadata = await sharp(inputPath).metadata();
    const isPng = metadata.format === 'png';
    const ext = isPng ? '.png' : '.jpg';

    const fileName = baseFilename
      ? `${baseFilename}-medium${ext}`
      : `medium${ext}`;
    const outputPath = path.join(outputDir, fileName);

    let pipeline = sharp(inputPath).resize(
      IMAGE_PROCESSING.MEDIUM_WIDTH,
      IMAGE_PROCESSING.MEDIUM_HEIGHT,
      {
        fit: 'inside',
        withoutEnlargement: true,
      },
    );

    if (isPng) {
      pipeline = pipeline.png({ compressionLevel: 9 });
    } else {
      pipeline = pipeline.jpeg({
        quality: IMAGE_PROCESSING.COMPRESSION_QUALITY,
      });
    }

    await pipeline.toFile(outputPath);

    const outputMetadata = await sharp(outputPath).metadata();
    const stats = await fs.stat(outputPath);

    return {
      path: outputPath,
      width: outputMetadata.width || 0,
      height: outputMetadata.height || 0,
      size: stats.size,
    };
  }

  /**
   * Generate thumbnail version (200x200, quality 90%, cover)
   */
  private async generateThumbnail(
    inputPath: string,
    outputDir: string,
    baseFilename?: string,
  ): Promise<ProcessedImageVersion> {
    const metadata = await sharp(inputPath).metadata();
    const isPng = metadata.format === 'png';
    const ext = isPng ? '.png' : '.jpg';

    const fileName = baseFilename
      ? `${baseFilename}-thumbnail${ext}`
      : `thumbnail${ext}`;
    const outputPath = path.join(outputDir, fileName);

    let pipeline = sharp(inputPath).resize(
      IMAGE_PROCESSING.THUMBNAIL_WIDTH,
      IMAGE_PROCESSING.THUMBNAIL_HEIGHT,
      {
        fit: 'cover',
      },
    );

    if (isPng) {
      pipeline = pipeline.png({ compressionLevel: 9 });
    } else {
      pipeline = pipeline.jpeg({
        quality: IMAGE_PROCESSING.COMPRESSION_QUALITY,
      });
    }

    await pipeline.toFile(outputPath);

    const outputMetadata = await sharp(outputPath).metadata();
    const stats = await fs.stat(outputPath);

    return {
      path: outputPath,
      width: outputMetadata.width || 0,
      height: outputMetadata.height || 0,
      size: stats.size,
    };
  }

  /**
   * Get image metadata
   */
  async getImageMetadata(filePath: string): Promise<sharp.Metadata> {
    return await sharp(filePath).metadata();
  }

  /**
   * Check if file is a valid image
   */
  async isValidImage(filePath: string): Promise<boolean> {
    try {
      await sharp(filePath).metadata();
      return true;
    } catch {
      return false;
    }
  }
}
