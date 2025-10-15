import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from 'src/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';

import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'pageroot'),
      exclude: ['/app/*'], // Exclui a API
      serveRoot: '/', // Serve na raiz da aplicação
    }),
    FileModule,
    ThrottlerModule.forRoot([
      // proteção conta ataque de força bruta
      {
        ttl: 60000, // tempo 1 minuto
        limit: 500, // 100 requisições
        // ignoreUserAgents: [/googlebot/],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
