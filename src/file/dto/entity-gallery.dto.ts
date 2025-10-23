import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { EntityType } from '../../../generated/prisma';

export class EntityGalleryDto {
  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @IsString()
  @IsNotEmpty()
  entityId: string;
}

export class EntityGalleryImageDto {
  id: string;
  originalName: string;
  uploadedAt: Date;
  tags: string[];
  isPrimary: boolean;
  displayOrder?: number | null;
  urls: {
    original: string;
    preview?: string;
    medium?: string;
    thumbnail?: string;
  };
}

export class EntityGalleryResponseDto {
  entityType: EntityType;
  entityId: string;
  totalImages: number;
  images: EntityGalleryImageDto[];
}
