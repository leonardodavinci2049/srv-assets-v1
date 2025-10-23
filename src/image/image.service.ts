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
  ): Promise<ProcessedImage> {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      const result: ProcessedImage = {
        original: await this.processOriginal(inputPath, outputDir),
      };

      // Generate preview if enabled
      if (IMAGE_PROCESSING.GENERATE_PREVIEW) {
        result.preview = await this.generatePreview(inputPath, outputDir);
      }

      // Generate medium if enabled
      if (IMAGE_PROCESSING.GENERATE_MEDIUM) {
        result.medium = await this.generateMedium(inputPath, outputDir);
      }

      // Generate thumbnail if enabled
      if (IMAGE_PROCESSING.GENERATE_THUMBNAIL) {
        result.thumbnail = await this.generateThumbnail(inputPath, outputDir);
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
  ): Promise<ProcessedImageVersion> {
    const outputPath = path.join(outputDir, 'original.jpg');

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Save original with metadata
    await image.toFile(outputPath);

    const stats = await fs.stat(outputPath);

    return {
      path: outputPath,
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: stats.size,
    };
  }

  /**
   * Generate preview version (800x600, quality 80%)
   */
  private async generatePreview(
    inputPath: string,
    outputDir: string,
  ): Promise<ProcessedImageVersion> {
    const outputPath = path.join(outputDir, 'preview.jpg');

    await sharp(inputPath)
      .resize(IMAGE_PROCESSING.PREVIEW_WIDTH, IMAGE_PROCESSING.PREVIEW_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: IMAGE_PROCESSING.COMPRESSION_QUALITY })
      .toFile(outputPath);

    const metadata = await sharp(outputPath).metadata();
    const stats = await fs.stat(outputPath);

    return {
      path: outputPath,
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: stats.size,
    };
  }

  /**
   * Generate medium version (400x400, quality 80%, inside)
   */
  private async generateMedium(
    inputPath: string,
    outputDir: string,
  ): Promise<ProcessedImageVersion> {
    const outputPath = path.join(outputDir, 'medium.jpg');

    await sharp(inputPath)
      .resize(IMAGE_PROCESSING.MEDIUM_WIDTH, IMAGE_PROCESSING.MEDIUM_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: IMAGE_PROCESSING.COMPRESSION_QUALITY })
      .toFile(outputPath);

    const metadata = await sharp(outputPath).metadata();
    const stats = await fs.stat(outputPath);

    return {
      path: outputPath,
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: stats.size,
    };
  }

  /**
   * Generate thumbnail version (200x200, quality 80%, cover)
   */
  private async generateThumbnail(
    inputPath: string,
    outputDir: string,
  ): Promise<ProcessedImageVersion> {
    const outputPath = path.join(outputDir, 'thumbnail.jpg');

    await sharp(inputPath)
      .resize(
        IMAGE_PROCESSING.THUMBNAIL_WIDTH,
        IMAGE_PROCESSING.THUMBNAIL_HEIGHT,
        {
          fit: 'cover',
        },
      )
      .jpeg({ quality: IMAGE_PROCESSING.COMPRESSION_QUALITY })
      .toFile(outputPath);

    const metadata = await sharp(outputPath).metadata();
    const stats = await fs.stat(outputPath);

    return {
      path: outputPath,
      width: metadata.width || 0,
      height: metadata.height || 0,
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
