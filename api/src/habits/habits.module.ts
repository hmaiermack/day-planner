import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

@Module({
  imports: [AuthModule],
  controllers: [HabitsController],
  providers: [HabitsService]
})
export class HabitsModule {}
