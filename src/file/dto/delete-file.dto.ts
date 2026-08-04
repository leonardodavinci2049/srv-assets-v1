import { IsUUID, IsNotEmpty } from 'class-validator';

/*
Sample JSON for testing in body endpoint:
{
  "id": "ffffffff-ffff-4fff-8fff-ffffffffffff"
}
*/
export class DeleteFileDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
