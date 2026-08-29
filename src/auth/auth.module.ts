import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config.js';
import { HashingService } from './hashing/haahing.service.js';
import { BcryptService } from './hashing/bcrypt.service.js';
import { PrismaModule } from '../database/prisma.module.js';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy.js';
@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, PassportModule],
      inject: [jwtConfig.KEY],
      useFactory: (
        jwtConfiguration: import('@nestjs/config').ConfigType<typeof jwtConfig>,
      ) => ({
        secret: jwtConfiguration.secret,
        signOptions: { expiresIn: jwtConfiguration.jwtTtl },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
    JwtStrategy,
  ],
  exports: [HashingService, JwtModule],
})
export class AuthModule {}
