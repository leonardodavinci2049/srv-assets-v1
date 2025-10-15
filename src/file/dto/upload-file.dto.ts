import { IsEnum, IsUUID, IsOptional, IsArray, IsString } from 'class-validator';
import { EntityType } from '../../../generated/prisma';

export class UploadFileDto {
  @IsEnum(EntityType)
  entityType: EntityType;

  @IsUUID()
  entityId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  altText?: string;
}
