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
  timeStart: Date;

  @IsNotEmpty()
  @IsDateString()
  timeEnd: Date;

  @IsOptional()
  @ValidateNested()
  tag?: TagDto;
}
