import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import {
  endOfDay,
  format,
  minTime,
  nextSaturday,
  previousSunday,
  startOfDay,
} from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteTaskDto } from './dto/deleteTask.dto';
import { NewTaskDto } from './dto/newTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  async getTasksForCurrentWeek(userId: number) {
    const now = Date.now();

    const weekStart = startOfDay(previousSunday(now));
    const weekEnd = endOfDay(nextSaturday(now));

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        timeStart: {
          gte: weekStart,
        },
        timeEnd: {
          lte: weekEnd,
        },
      },
      include: {
        tag: true,
      },
      orderBy: {
        timeStart: 'asc',
      },
    });

    //create a nicely formatted object to send to the client
    //might as well initialize it with week start and end which will be needed client side
    let taskMap = {
      weekStart,
      weekEnd,
    };
    tasks.forEach((task) => {
      const day = format(task.timeStart, 'eeee');
      if (!taskMap[day]) taskMap[day] = [];
      taskMap[`${day}`].push(task);
    });

    return taskMap;
  }

  async createTask(userId: number, dto: NewTaskDto): Promise<Task> {
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

  async updateTask(dto: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (dto.tag) {
      const updatedTask = await this.prisma.task.update({
        where: {
          id: dto.id,
        },
        data: {
          title: dto.title ? dto.title : task.title,
          timeStart: dto.timeStart ? dto.timeStart : task.timeStart,
          timeEnd: dto.timeEnd ? dto.timeEnd : task.timeEnd,
          tag: {
            upsert: {
              create: {
                name: dto.tag.name,
                colorHexValue: dto.tag.colorHexValue,
              },
              update: {
                name: dto.tag.name,
                colorHexValue: dto.tag.colorHexValue,
              },
            },
          },
        },
        include: {
          tag: true,
        },
      });
      return updatedTask;
    }

    const updatedTask = await this.prisma.task.update({
      where: {
        id: dto.id,
      },
      data: {
        title: dto.title ? dto.title : task.title,
        timeStart: dto.timeStart ? dto.timeStart : task.timeStart,
        timeEnd: dto.timeEnd ? dto.timeEnd : task.timeEnd,
      },
      include: {
        tag: true,
      },
    });

    return updatedTask;
  }

  async deleteTask(dto: DeleteTaskDto) {
    await this.prisma.task.delete({
      where: {
        id: dto.id,
      },
    });

    return true;
  }
}
