import { Injectable } from '@nestjs/common';
import { Habit } from '@prisma/client';
import { eachDayOfInterval, endOfToday, format, isSameDay, parseISO, startOfDay, startOfToday, subDays, subMonths } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteHabitDto } from './dto/deleteHabit.dto';
import { DoHabitDto } from './dto/doHabit.dto';
import { NewHabitDto } from './dto/newHabit.dto';
import { UndoHabitDto } from './dto/undoHabit.dto';
import { UpdateHabitDto } from './dto/updateHabit.dto';


export interface Day {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4
}

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

    async getHabitGraphData(userId: number): Promise<Day[]> {

        const habits = await this.prisma.habit.findMany({
            where: {
                userId
            }
        })

        const completedHabits = await this.prisma.completedHabit.findMany({
            where: {
                userId
            }
        })

        console.log(completedHabits)

        const intervalStart = subMonths(Date.now(), 3)
        const intervalEnd = subDays(Date.now(), 1)

        const intervalArray = eachDayOfInterval({start: intervalStart, end: intervalEnd})
        console.log(intervalArray[0])
        
        const graphData: Day[] = []
        
        //populate the graphData with proplerly formatted date
        intervalArray.forEach(date => {
            let dateString = format(date, "yyyy-MM-dd")
            graphData.push({
                date: dateString,
                count: 0,
                level: 0
            })
        })

        // console.log({habits})
        console.log(parseInt(format(parseISO('2022-04-10'), "i")))

        graphData.forEach(item => {
            const weekday = parseInt(format(parseISO(item.date), "i"))
            let completedCount = 0
            
            habits.forEach(habit => {
                if(habit.habitDays[weekday-1] == true) item.count += 1
            })

            completedHabits.forEach(completedHabit => {
                // console.log({
                //     itemDate: parseISO(item.date),
                //     completeDate: completedHabit.dateCompleted,
                //     isSame: isSameDay(parseISO(item.date), completedHabit.dateCompleted)
                // })
                if(isSameDay(parseISO(item.date), completedHabit.dateCompleted)) completedCount += 1
            })
            const adherencePercentage = completedCount / item.count
            
            if(adherencePercentage == 1) {
                item.level = 4
            } else if (adherencePercentage <= .99 && adherencePercentage >= .66) {
                item.level = 3
            } else if (adherencePercentage <= .65 && adherencePercentage >= .33) {
                item.level = 2
            } else if (adherencePercentage <= .32 && adherencePercentage >= .01) {
                item.level = 1
            } else {
                item.level = 0
            }
        })
        
        return graphData
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

    async doHabit(userId: number, dto: DoHabitDto) {
        await this.prisma.completedHabit.create({
            data: {
                habit: {
                    connect: {
                        id: dto.id
                    }
                },
                user: {
                    connect: {
                        id: userId
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
