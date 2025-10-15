import { fileTypeFromBuffer } from 'file-type';
import { FileType } from '../../../generated/prisma';

/**
 * Allowed MIME types configuration
 */
export const ALLOWED_MIME_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  SPREADSHEET: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ],
};

/**
 * Allowed file extensions
 */
export const ALLOWED_EXTENSIONS = {
  IMAGE: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  DOCUMENT: ['.pdf', '.doc', '.docx', '.txt'],
  SPREADSHEET: ['.xls', '.xlsx', '.csv'],
};

/**
 * Validate MIME type using magic numbers (file-type library)
 */
export async function validateFileMagicNumbers(
  buffer: Buffer,
  expectedMimeType: string,
): Promise<boolean> {
  try {
    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType) {
      return false;
    }

    return fileType.mime === expectedMimeType;
  } catch {
    return false;
  }
}

/**
 * Determine FileType based on MIME type
 */
export function determineFileType(mimeType: string): FileType | null {
  if (ALLOWED_MIME_TYPES.IMAGE.includes(mimeType)) {
    return FileType.IMAGE;
  }
  if (ALLOWED_MIME_TYPES.DOCUMENT.includes(mimeType)) {
    return FileType.DOCUMENT;
  }
  if (ALLOWED_MIME_TYPES.SPREADSHEET.includes(mimeType)) {
    return FileType.SPREADSHEET;
  }
  return null;
}

/**
 * Check if MIME type is allowed
 */
export function isAllowedMimeType(mimeType: string): boolean {
  return (
    ALLOWED_MIME_TYPES.IMAGE.includes(mimeType) ||
    ALLOWED_MIME_TYPES.DOCUMENT.includes(mimeType) ||
    ALLOWED_MIME_TYPES.SPREADSHEET.includes(mimeType)
  );
}

/**
 * Check if file is an image
 */
export function isImage(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.IMAGE.includes(mimeType);
}

/**
 * Get all allowed MIME types as flat array
 */
export function getAllowedMimeTypes(): string[] {
  return [
    ...ALLOWED_MIME_TYPES.IMAGE,
    ...ALLOWED_MIME_TYPES.DOCUMENT,
    ...ALLOWED_MIME_TYPES.SPREADSHEET,
  ];
}
