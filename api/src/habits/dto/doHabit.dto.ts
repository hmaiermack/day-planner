import { IsNumber } from 'class-validator';

export class DoHabitDto {
  @IsNumber()
  id: number;
}
