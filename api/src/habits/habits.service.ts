import { Injectable } from '@nestjs/common';
import { Habit } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewHabitDto } from './dto/newHabit.dto';
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

    async deleteHabit(habitId: number) {

    }

    async doHabit(userId: number, habitId: number) {

    }

    async undoHabit(habitId: number) {
        
    }
}
