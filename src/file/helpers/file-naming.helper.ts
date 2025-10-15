import * as path from 'path';
import sanitize from 'sanitize-filename';

/**
 * Sanitize filename following these rules:
 * - Convert to lowercase
 * - Remove special characters
 * - Replace spaces with hyphens
 * - Remove accents
 * - Maximum 100 characters
 */
export function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);

  const sanitized = sanitize(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace special chars with hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Max 100 chars

  return sanitized + ext.toLowerCase();
}

/**
 * Extract file extension from filename
 */
export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

/**
 * Get filename without extension
 */
export function getFilenameWithoutExtension(filename: string): string {
  return path.basename(filename, path.extname(filename));
}

/**
 * Validate if filename has a valid extension
 */
export function hasValidExtension(
  filename: string,
  allowedExtensions: string[],
): boolean {
  const ext = getFileExtension(filename);
  return allowedExtensions.includes(ext);
}
