import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { EntityType } from '../../../generated/prisma';

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
