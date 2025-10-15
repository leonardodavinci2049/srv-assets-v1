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
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { FileQueryDto } from './dto/file-query.dto';
import { FileResponseDto, FileListResponseDto } from './dto/file-response.dto';
import { isAllowedMimeType } from './helpers/file-validation.helper';

type MulterFile = Express.Multer.File;

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
    @UploadedFile() file: MulterFile | undefined,
    @Body() uploadFileDto: UploadFileDto,
    @Req() req: Request,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate MIME type
    const mimeType = file.mimetype;
    if (!mimeType || !isAllowedMimeType(mimeType)) {
      throw new BadRequestException(
        `File type ${mimeType || 'unknown'} is not allowed`,
      );
    }

    const ipAddress: string | undefined = req.ip || req.socket?.remoteAddress;
    const userAgent: string | undefined = req.headers['user-agent'];

    return await this.fileService.upload(
      file,
      uploadFileDto,
      ipAddress,
      userAgent,
    );
  }

  @Get('list')
  async list(@Query() query: FileQueryDto): Promise<FileListResponseDto> {
    return await this.fileService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FileResponseDto> {
    return await this.fileService.findOne(id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ success: boolean; message: string }> {
    const ipAddress: string | undefined = req.ip || req.socket?.remoteAddress;
    const userAgent: string | undefined = req.headers['user-agent'];

    return await this.fileService.delete(id, ipAddress, userAgent);
  }
}
