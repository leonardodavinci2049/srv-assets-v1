import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { envs } from '../config/envs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      this.logger.warn('API Key missing in request');
      throw new UnauthorizedException('API Key is required');
    }

    if (apiKey !== envs.APP_API_SECRET) {
      this.logger.warn(`Invalid API Key attempt: ${apiKey}`);
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
