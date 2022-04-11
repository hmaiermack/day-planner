import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { DeleteHabitDto } from './dto/deleteHabit.dto';
import { DoHabitDto } from './dto/doHabit.dto';
import { NewHabitDto } from './dto/newHabit.dto';
import { UndoHabitDto } from './dto/undoHabit.dto';
import { UpdateHabitDto } from './dto/updateHabit.dto';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
    constructor(private habitsService: HabitsService) {}

    @Get()
    getHabits(@GetCurrentUserId() userId: number) {
        return this.habitsService.getHabits(userId)
    }

    @Post()
    createNewHabit(@GetCurrentUserId() userId: number, @Body() dto: NewHabitDto) {
        return this.habitsService.createNewHabit(userId, dto)
    }

    @Put('/update')
    updateHabit(@Body() dto: UpdateHabitDto) {
        return this.habitsService.updateHabit(dto)
    }

    @Delete()
    deleteHabit(@Body() dto: DeleteHabitDto) {
        return this.habitsService.deleteHabit(dto)
    }

    @Post('/do')
    doHabit(@Body() dto: DoHabitDto) {
        return this.habitsService.doHabit(dto)
    }

    @Delete('/undo')
    @HttpCode(HttpStatus.NO_CONTENT)
    undoHabit(@Body() dto: UndoHabitDto) {
        return this.habitsService.undoHabit(dto)
    }
}
