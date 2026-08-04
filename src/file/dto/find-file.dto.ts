import { IsUUID, IsNotEmpty } from 'class-validator';

/*
Sample JSON for testing in body endpoint:
{
  "id": "11111111-1111-4111-8111-111111111111"
}
*/
export class FindFileDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
