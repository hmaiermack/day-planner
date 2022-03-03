import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TagDto } from './tag.dto';

export class NewTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  timeStart: string;

  @IsNotEmpty()
  @IsDateString()
  timeEnd: string;

  @IsOptional()
  @ValidateNested()
  tag?: TagDto;
}
