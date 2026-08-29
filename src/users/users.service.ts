import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { PrismaService } from '../database/prisma.service.js';
import { HashingService } from '../auth/hashing/haahing.service.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const userHash = await this.hashingService.hash(createUserDto.password);
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: userHash,
      },
    });
  }
}
