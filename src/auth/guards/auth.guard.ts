import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config.js';
import type { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtconfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token ausente');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtconfiguration.secret,
        audience: this.jwtconfiguration.audience,
        issuer: this.jwtconfiguration.issuer,
      });
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') {
      return undefined;
    }
    const parts = authorization.split(' ');
    if (parts.length !== 2) return undefined;
    return parts[1];
  }
}
