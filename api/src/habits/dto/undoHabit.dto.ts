import { IsNumber } from 'class-validator';

export class UndoHabitDto {
  @IsNumber()
  id: number;
}
