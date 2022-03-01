import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewTaskDto } from './dto/newTask.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  async getTasks() {
    const tasks = await this.prisma.task.findMany();

    return tasks;
  }

  async createTask(userId: number, dto: NewTaskDto) {
    const tag = dto.tag;

    if (tag) {
      const task = await this.prisma.task.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          title: dto.title,
          timeStart: dto.timeStart,
          timeEnd: dto.timeEnd,
          tag: {
            connectOrCreate: {
              where: {
                name: tag.name,
              },
              create: {
                name: tag.name,
                colorHexValue: tag.colorHexValue,
              },
            },
          },
        },
        include: {
          tag: true,
        },
      });

      return task;
    }

    const task = await this.prisma.task.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        title: dto.title,
        timeStart: dto.timeStart,
        timeEnd: dto.timeEnd,
      },
    });

    return task;
  }
}
