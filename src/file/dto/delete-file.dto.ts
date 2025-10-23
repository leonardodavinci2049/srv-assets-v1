import { IsUUID, IsNotEmpty } from 'class-validator';

export class DeleteFileDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
