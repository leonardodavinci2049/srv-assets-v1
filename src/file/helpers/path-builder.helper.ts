import * as path from 'node:path';
import type { FileType } from '../../../generated/prisma/client.js';

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

/**
 * Extract date parts from basePath
 * Example: upload/images/2025/12/02/uuid -> { year: 2025, month: '12', day: '02' }
 */
export function extractDatePartsFromPath(basePath: string): {
  year: number;
  month: string;
  day: string;
} {
  const parts = basePath.split(path.sep);
  // Expected format: upload/images/YYYY/MM/DD/uuid
  const yearIndex = parts.findIndex((part) => /^\d{4}$/.test(part));

  if (yearIndex === -1 || yearIndex + 2 >= parts.length) {
    throw new Error(`Invalid basePath format: ${basePath}`);
  }

  return {
    year: Number.parseInt(parts[yearIndex], 10),
    month: parts[yearIndex + 1],
    day: parts[yearIndex + 2],
  };
}
