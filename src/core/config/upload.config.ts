/**
 * Upload Configuration
 * Defines file size limits and allowed types per category
 */

// File size limits in bytes
export const FILE_SIZE_LIMITS = {
  IMAGE: 2 * 1024 * 1024, // 2MB
  DOCUMENT: 5 * 1024 * 1024, // 5MB
  SPREADSHEET: 5 * 1024 * 1024, // 5MB
  GLOBAL: 10 * 1024 * 1024, // 10MB max per request
};

// Maximum number of files per upload request
export const MAX_FILES_PER_REQUEST = 10;

// Temporary upload directory
export const TEMP_UPLOAD_DIR = './upload/temp';

// Base upload directory
export const BASE_UPLOAD_DIR = './upload';

// Image processing settings
export const IMAGE_PROCESSING = {
  GENERATE_THUMBNAIL: true,
  THUMBNAIL_WIDTH: 200,
  THUMBNAIL_HEIGHT: 200,
  GENERATE_PREVIEW: true,
  PREVIEW_WIDTH: 800,
  PREVIEW_HEIGHT: 600,
  COMPRESSION_QUALITY: 80,
};

// File version types
export enum FileVersionType {
  ORIGINAL = 'original',
  PREVIEW = 'preview',
  THUMBNAIL = 'thumbnail',
}

// Asset status transitions
export const ASSET_STATUS_TRANSITIONS = {
  PROCESSING: ['ACTIVE', 'DELETED'],
  ACTIVE: ['ARCHIVED', 'DELETED'],
  ARCHIVED: ['ACTIVE', 'DELETED'],
  DELETED: [], // Cannot transition from deleted
};
