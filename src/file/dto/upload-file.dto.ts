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
import { EntityType } from '../../../generated/prisma';

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
