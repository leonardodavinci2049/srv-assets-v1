import {
  IsEnum,
  IsOptional,
  IsArray,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';
import { EntityType } from '../../generated/prisma/client.js';

/*
Sample JSON for testing in body endpoint (multipart fields; send the file separately):
{
  "entityType": "PRODUCT",
  "entityId": "00000000-0000-4000-8000-000000000001",
  "tags": ["test", "product"],
  "description": "Test asset upload",
  "altText": "Test product image",
  "isPrimary": true,
  "displayOrder": 1
}
*/
export class UploadFileDto {
  @IsEnum(EntityType)
  entityType: EntityType;

  @IsString()
  @IsNotEmpty()
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

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  displayOrder?: number;
}
