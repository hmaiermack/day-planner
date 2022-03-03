import { Test, TestingModule } from '@nestjs/testing';
import { formatISO } from 'date-fns';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { NewTaskDto } from 'src/tasks/dto/newTask.dto';
import { AuthService } from 'src/auth/auth.service';
import { User } from '@prisma/client';
import { TasksService } from 'src/tasks/tasks.service';

const testUser = {
  email: 'test@example.com',
  password: 'SecretPass1!',
};

const timeStart = formatISO(Date.now());
const timeEnd = formatISO(Date.now() + 100);

describe('TaskService Integration Test', () => {
  let prisma: PrismaService;
  let moduleRef: TestingModule;
  let authService: AuthService;
  let taskService: TasksService;

  jest.setTimeout(15000);
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);
    taskService = moduleRef.get(TasksService);
    await prisma.cleanDatabase();
  });

  describe('createTask()', () => {
    console.log({ timeStart, timeEnd });
    const dto: NewTaskDto = {
      title: 'Task Title!',
      timeStart,
      timeEnd,
    };
    let user: User | null;

    it('should create a new user', async () => {
      await authService.signUpLocal({
        email: testUser.email,
        password: testUser.password,
      });

      user = await prisma.user.findFirst({
        where: {
          email: testUser.email,
        },
      });
    });

    it('should create a new task', async () => {
      const task = await taskService.createTask(user.id, dto);
      expect(task.title).toBe(dto.title);
      console.log({ task, timeStart });
      expect(task.timeStart).toBe(dto.timeStart);
      expect(task.timeEnd).toBe(dto.timeEnd);
    });
  });
});
