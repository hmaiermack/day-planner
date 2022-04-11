import { IsNumber } from 'class-validator';

export class DeleteHabitDto {
  @IsNumber()
  id: number;
}
