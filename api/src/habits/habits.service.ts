import { Injectable } from '@nestjs/common';
import { Habit } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewHabitDto } from './dto/newHabit.dto';

@Injectable()
export class HabitsService {
    constructor(private prisma: PrismaService) {}

    async getHabits(userId: number): Promise<Habit[]> {
        const habits = await this.prisma.habit.findMany({
            where: {
                userId
            }
        })

        return habits
    }

    async createHabit(userId: number, dto: NewHabitDto): Promise<Habit> {
        
        
        if(dto.remindTime) {
            const habit = await this.prisma.habit.create({
                data: {
                    user: {
                        connect: {
                            id: userId
                        }
                    },
                    name: dto.name,
                    habitDays: dto.habitDays,
                    remindTime: dto.remindTime,
                    remindDays: dto.remindDays
                }
            })

            return habit
        }

        const habit = await this.prisma.habit.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                name: dto.name,
                habitDays: dto.habitDays,
            }

        })

        return habit
    }
}
