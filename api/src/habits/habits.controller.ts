import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { CompletedHabit, Habit } from '@prisma/client';
import { GetCurrentUserId } from 'src/common/decorators';
import { DeleteHabitDto } from './dto/deleteHabit.dto';
import { DoHabitDto } from './dto/doHabit.dto';
import { NewHabitDto } from './dto/newHabit.dto';
import { UndoHabitDto } from './dto/undoHabit.dto';
import { UpdateHabitDto } from './dto/updateHabit.dto';
import { HabitsService } from './habits.service';
import { Day, GraphResponse } from './types';

@Controller('habits')
export class HabitsController {
    constructor(private habitsService: HabitsService) {}

    @Get()
    getHabits(@GetCurrentUserId() userId: number): Promise<Habit[]> {
        return this.habitsService.getHabits(userId)
    }

    @Get('/graph')
    getHabitGraphData(@GetCurrentUserId() userId: number): Promise<GraphResponse>{
        return this.habitsService.getHabitGraphData(userId)
    }

    @Post()
    createNewHabit(@GetCurrentUserId() userId: number, @Body() dto: NewHabitDto): Promise<Habit> {
        return this.habitsService.createNewHabit(userId, dto)
    }

    @Put('/update')
    updateHabit(@Body() dto: UpdateHabitDto): Promise<Habit> {
        return this.habitsService.updateHabit(dto)
    }

    @Delete()
    deleteHabit(@Body() dto: DeleteHabitDto): Promise<void> {
        return this.habitsService.deleteHabit(dto)
    }

    @Post('/do')
    doHabit(@GetCurrentUserId() userId: number, @Body() dto: DoHabitDto): Promise<CompletedHabit> {
        return this.habitsService.doHabit(userId, dto)
    }

    @Delete('/undo')
    @HttpCode(HttpStatus.NO_CONTENT)
    undoHabit(@Body() dto: UndoHabitDto): Promise<void> {
        return this.habitsService.undoHabit(dto)
    }
}
