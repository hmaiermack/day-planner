import {
  ArrayContains,
  ArrayMaxSize,
  ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class NewHabitDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(7)
    @ArrayMaxSize(7)
    habitDays: boolean[]

    @IsOptional()
    @IsString()
    remindTime?: string

    @IsOptional()
    @IsArray()
    @ArrayMinSize(7)
    @ArrayMaxSize(7)
    remindDays?: boolean[]
  }
  