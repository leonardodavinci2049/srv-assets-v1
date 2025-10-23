import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindFileDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
