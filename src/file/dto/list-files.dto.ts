import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  EntityType,
  FileType,
  AssetStatus,
} from '../../generated/prisma/client.js';

/*
Sample JSON for testing in body endpoint:
{
  "entityType": "PRODUCT",
  "entityId": "00000000-0000-4000-8000-000000000001",
  "fileType": "IMAGE",
  "status": "ACTIVE",
  "page": 1,
  "limit": 20
}
*/
export class ListFilesDto {
  @IsOptional()
  @IsEnum(EntityType)
  entityType?: EntityType;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsEnum(FileType)
  fileType?: FileType;

  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus = AssetStatus.ACTIVE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
