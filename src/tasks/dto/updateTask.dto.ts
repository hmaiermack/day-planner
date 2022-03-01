import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TagDto } from './tag.dto';

export class UpdateTaskDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsDateString()
  timeStart: Date;

  @IsOptional()
  @IsDateString()
  timeEnd: Date;

  @IsOptional()
  @ValidateNested()
  tag: TagDto;
}
