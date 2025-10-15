import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  /**
   * Save file to specified path
   */
  async saveFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      // Ensure destination directory exists
      await this.ensureDirectoryExists(path.dirname(destinationPath));

      // Copy file to destination
      await fs.copyFile(sourcePath, destinationPath);

      this.logger.log(`File saved successfully: ${destinationPath}`);
    } catch (error) {
      this.logger.error(`Failed to save file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Move file from source to destination
   */
  async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
    try {
      // Ensure destination directory exists
      await this.ensureDirectoryExists(path.dirname(destinationPath));

      // Move file
      await fs.rename(sourcePath, destinationPath);

      this.logger.log(`File moved successfully: ${destinationPath}`);
    } catch (error) {
      this.logger.error(`Failed to move file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete file at specified path
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      this.logger.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete directory and all its contents
   */
  async deleteDirectory(dirPath: string): Promise<void> {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
      this.logger.log(`Directory deleted successfully: ${dirPath}`);
    } catch (error) {
      this.logger.error(`Failed to delete directory: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file size in bytes
   */
  async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  /**
   * Ensure directory exists, create if it doesn't
   */
  async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      this.logger.log(`Directory created: ${dirPath}`);
    }
  }

  /**
   * Read file buffer
   */
  async readFileBuffer(filePath: string): Promise<Buffer> {
    return await fs.readFile(filePath);
  }

  /**
   * Write buffer to file
   */
  async writeFileBuffer(filePath: string, buffer: Buffer): Promise<void> {
    await this.ensureDirectoryExists(path.dirname(filePath));
    await fs.writeFile(filePath, buffer);
  }
}
