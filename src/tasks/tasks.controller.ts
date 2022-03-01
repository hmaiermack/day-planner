import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetCurrentUserId, PublicRoute } from 'src/common/decorators';
import { NewTaskDto } from './dto/newTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @PublicRoute()
  @Get()
  getTasksForWeek() {
    //not actually tasks for week
    return this.tasksService.getTasks();
  }

  @Post()
  createNewTask(@GetCurrentUserId() userId: number, @Body() dto: NewTaskDto) {
    return this.tasksService.createTask(userId, dto);
  }

  @Post('/update')
  updateTask(@Body() dto: UpdateTaskDto) {
    return this.tasksService.updateTask(dto);
  }
}
