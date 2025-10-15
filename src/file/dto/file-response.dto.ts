import { FileType, AssetStatus, EntityType } from '../../../generated/prisma';

export class AssetVersionDto {
  versionType: string;
  fileName: string;
  url: string;
  fileSize: number;
  width?: number;
  height?: number;
}

export class FileResponseDto {
  id: string;
  entityType: EntityType;
  entityId: string;
  originalName: string;
  fileType: FileType;
  mimeType: string;
  fileSize: number;
  status: AssetStatus;
  uploadedAt: Date;
  tags: string[];

  versions: AssetVersionDto[];

  urls: {
    original: string;
    preview?: string;
    thumbnail?: string;
  };
}

export class FileListResponseDto {
  data: FileResponseDto[];
  total: number;
  page: number;
  limit: number;
}
