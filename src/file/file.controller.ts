import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { isAllowedMimeType } from './helpers/file-validation.helper';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getStatus() {
    return {
      name: 'SRV_ASSETS',
      status: 'online',
      version: '1.0.0',
      documentation: '/',
      timestamp: new Date().toISOString(),
      endpoints: {
        base: '/api',
        upload: '/api/file/upload',
        list: '/api/file/list',
        getOne: '/api/file/:id',
        delete: '/api/file/:id',
      },
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate MIME type
    if (!isAllowedMimeType(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed`,
      );
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return await this.fileService.upload(
      file,
      uploadFileDto,
      ipAddress,
      userAgent,
    );
  }

  @Get('list')
  async list(@Query() query: FileQueryDto) {
    return await this.fileService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.fileService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return await this.fileService.delete(id, ipAddress, userAgent);
  }
}
