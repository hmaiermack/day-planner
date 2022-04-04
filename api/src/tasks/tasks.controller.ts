import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { DeleteTaskDto } from './dto/deleteTask.dto';
import { NewTaskDto } from './dto/newTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasksForCurrentWeek(@GetCurrentUserId() userId: number) {
    //not actually tasks for week
    return this.tasksService.getTasksForCurrentWeek(userId);
  }

  @Post()
  createNewTask(@GetCurrentUserId() userId: number, @Body() dto: NewTaskDto) {
    return this.tasksService.createTask(userId, dto);
  }

  @Post('/update')
  updateTask(@Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(dto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTask(@Body() dto: DeleteTaskDto) {
    return this.tasksService.deleteTask(dto);
  }
}
