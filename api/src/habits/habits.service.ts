import { Injectable } from '@nestjs/common';
import { Habit } from '@prisma/client';
import { endOfToday, startOfDay, startOfToday } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteHabitDto } from './dto/deleteHabit.dto';
import { DoHabitDto } from './dto/doHabit.dto';
import { NewHabitDto } from './dto/newHabit.dto';
import { UndoHabitDto } from './dto/undoHabit.dto';
import { UpdateHabitDto } from './dto/updateHabit.dto';

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

    async createNewHabit(userId: number, dto: NewHabitDto): Promise<Habit> {
        
        
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
                remindDays: []
            }

        })

        return habit
    }

    async updateHabit(dto: UpdateHabitDto): Promise<Habit> {

        const habit = await this.prisma.habit.findUnique({
            where: {
                id: dto.id
            }
        })

        const updatedHabit = await this.prisma.habit.update({
            where: {
                id: dto.id
            },
            data: {
                name: dto.name ? dto.name : habit.name,
                habitDays: dto.habitDays ? dto.habitDays : habit.habitDays,
                remindTime: dto.remindTime ? dto.remindTime : habit.remindTime,
                remindDays: dto.remindDays ? dto.remindDays : habit.remindDays

            }
        })

        return updatedHabit
    }

    async deleteHabit(dto: DeleteHabitDto) {
        await this.prisma.habit.delete({
            where: {
                id: dto.id
            }
        })

        return true
    }

    async doHabit(dto: DoHabitDto) {
        await this.prisma.completedHabit.create({
            data: {
                habit: {
                    connect: {
                        id: dto.id
                    }
                },
                dateCompleted: new Date()
            }
        })
    }

    async undoHabit(dto: UndoHabitDto) {
        // get the beginning and end values of todays timestamp
        // to be used for filtering the query
        // this feels bad
        const startOfDay = startOfToday()
        const endOfDay = endOfToday()

        await this.prisma.completedHabit.deleteMany({
            where: {
                habitId: dto.id,
                dateCompleted: {
                    gte: startOfDay,
                    lt: endOfDay
                }
            }
        })
    }
}
