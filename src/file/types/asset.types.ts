import { AssetStatus, FileType, EntityType } from '../../../generated/prisma';

export interface AssetWithVersionsAndTags {
  id: string;
  entityType: EntityType;
  entityId: string;
  originalName: string;
  sanitizedName: string;
  fileType: FileType;
  mimeType: string;
  fileSize: number;
  basePath: string;
  status: AssetStatus;
  uploadedAt: Date;
  deletedAt?: Date | null;
  metadata: any;
  versions: AssetVersion[];
  tags: AssetTag[];
}

export interface AssetVersion {
  id: string;
  assetId: string;
  versionType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  isProcessed: boolean;
  createdAt: Date;
}

export interface AssetTag {
  id: string;
  assetId: string;
  tag: string;
  createdAt: Date;
}
