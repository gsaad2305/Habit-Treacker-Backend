import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import jwtConfig from './config/jwt.config.js';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service.js';
import { HashingService } from './hashing/haahing.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async create(loginDto: LoginDto) {
    const userValid = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!userValid) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const isPasswordMatch = await this.hashingService.compare(
      loginDto.password,
      userValid.password,
    );
    if (!isPasswordMatch) throw new UnauthorizedException('Password invalid');
    const acessToken = await this.jwtService.signAsync(
      {
        sub: userValid?.id,
        email: userValid.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
      },
    );
    return {
      acessToken,
    };
  }
}
