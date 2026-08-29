import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { PrismaService } from '../database/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createTaskDto: CreateTaskDto, userId: string) {
    return await this.prismaService.task.create({
      data: {
        ...createTaskDto,
        userId: userId,
      },
    });
  }

  async findAll(userId: string) {
    return await this.prismaService.task.findMany({ where: { userId } });
  }

  async findOne(id: string, userId: string) {
    return await this.prismaService.task.findUnique({ where: { id, userId } });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.prismaService.task.findUnique({
      where: { id, userId },
    });
    if (!task) throw new NotFoundException('A task não existe');
    return this.prismaService.task.update({
      where: { id: task.id },
      data: updateTaskDto,
    });
  }

  async remove(id: string) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id,
      },
    });

    if (task) return this.prismaService.task.delete({ where: { id } });
    throw new NotFoundException('A task não existe');
  }
}
