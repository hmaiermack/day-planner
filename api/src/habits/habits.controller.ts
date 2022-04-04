import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { NewHabitDto } from './dto/newHabit.dto';
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

    @Post('/update')
    updateHabit(@Body() dto: UpdateHabitDto) {
        return this.habitsService.updateHabit(dto)
    }

    @Delete()
    deleteHabit(@Body() habitId: number) {
        return this.habitsService.deleteHabit(habitId)
    }

    @Post('/do')
    doHabit(@GetCurrentUserId() userId: number, @Body habitId: number) {
        return this.habitsService.doHabit(userId, habitId)
    }

    @Delete('/undo')
    @HttpCode(HttpStatus.NO_CONTENT)
    undoHabit(@Body() habitId: number) {
        return this.habitsService.undoHabit(habitId)
    }
}
