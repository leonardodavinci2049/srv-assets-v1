import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { EntityType } from '../../generated/prisma/client.js';

/*
Sample JSON for testing in body endpoint set-primary-image:
{
  "entityType": "PRODUCT",
  "entityId": "00000000-0000-4000-8000-000000000001",
  "assetId": "22222222-2222-4222-8222-222222222222",
  "displayOrder": 1
}
*/
export class UpdatePrimaryImageDto {
  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsString()
  @IsNotEmpty()
  assetId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  displayOrder?: number;
}

/*
Sample JSON for testing in body endpoint reorder-images:
{
  "entityType": "PRODUCT",
  "entityId": "00000000-0000-4000-8000-000000000001",
  "assetIds": [
    "33333333-3333-4333-8333-333333333333",
    "44444444-4444-4444-8444-444444444444"
  ]
}
*/
export class ReorderImagesDto {
  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsString({ each: true })
  @IsNotEmpty()
  assetIds: string[]; // Array ordenado dos IDs das imagens
}
