import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileService } from './file.service.js';
import { FileController } from './file.controller.js';
import { StorageModule } from '../storage/storage.module.js';
import { ImageModule } from '../image/image.module.js';
import {
  TEMP_UPLOAD_DIR,
  FILE_SIZE_LIMITS,
} from '../core/config/upload.config.js';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: TEMP_UPLOAD_DIR,
        filename: (req, file, cb) => {
          const uuid = uuidv4();
          const ext = extname(file.originalname);
          cb(null, `${uuid}${ext}`);
        },
      }),
      limits: {
        fileSize: FILE_SIZE_LIMITS.GLOBAL,
      },
    }),
    StorageModule,
    ImageModule,
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
