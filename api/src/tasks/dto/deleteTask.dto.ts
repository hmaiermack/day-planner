import { IsNumber } from 'class-validator';

export class DeleteTaskDto {
  @IsNumber()
  id: number;
}
