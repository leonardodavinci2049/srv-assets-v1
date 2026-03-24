import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionUrl = new URL(process.env.DATABASE_URL!);
    const adapter = new PrismaMariaDb({
      host: connectionUrl.hostname,
      port: Number(connectionUrl.port) || 3306,
      user: connectionUrl.username,
      password: connectionUrl.password,
      database: connectionUrl.pathname.slice(1),
    });
    super({ adapter, log: ['warn', 'error'] });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Successfully connected to database');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error);
      throw error;
    }
  }

  enableShutdownHooks(app: { close: () => Promise<void> }): void {
    process.on('beforeExit', () => {
      void app.close();
    });
  }
}
