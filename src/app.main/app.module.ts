import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from 'src/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '../prisma/prisma.module';

import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Serve pageroot at root /
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'pageroot'),
      exclude: ['/api/*'],
      serveRoot: '/',
    }),

    // Serve upload files at /uploads
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'upload'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
        cacheControl: true,
        maxAge: 86400000, // 1 day
      },
    }),

    PrismaModule,
    FileModule,
    ThrottlerModule.forRoot([
      // Protection against brute force attacks
      {
        ttl: 60000, // 1 minute
        limit: 500, // 500 requests
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
