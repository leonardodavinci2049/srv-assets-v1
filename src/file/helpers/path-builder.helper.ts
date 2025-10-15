import * as path from 'path';
import { FileType } from '../../../generated/prisma';

/**
 * Build file path following the structure:
 * upload/{type}/{year}/{month}/{day}/{uuid}/
 */
export function buildFilePath(fileType: FileType, fileId: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // Map FileType enum to directory name
  const typeDir = fileType.toLowerCase() + 's'; // IMAGE -> images

  const basePath = path.join(
    'upload',
    typeDir,
    String(year),
    month,
    day,
    fileId,
  );

  return basePath;
}

/**
 * Get the full file path with filename
 */
export function getFullFilePath(basePath: string, filename: string): string {
  return path.join(basePath, filename);
}

/**
 * Build public URL for accessing the file
 */
export function buildPublicUrl(
  baseUrl: string,
  fileType: FileType,
  year: number,
  month: string,
  day: string,
  fileId: string,
  filename: string,
): string {
  const typeDir = fileType.toLowerCase() + 's';
  return `${baseUrl}/uploads/${typeDir}/${year}/${month}/${day}/${fileId}/${filename}`;
}

/**
 * Extract date parts from current date
 */
export function getDateParts(): { year: number; month: string; day: string } {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: String(now.getMonth() + 1).padStart(2, '0'),
    day: String(now.getDate()).padStart(2, '0'),
  };
}
