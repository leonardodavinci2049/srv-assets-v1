import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileService {
  create(createFileDto: CreateFileDto) {
    return createFileDto;
  }
}
