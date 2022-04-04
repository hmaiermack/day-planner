import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
  } from 'class-validator';
  
  export class NewHabitDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsArray()
    @MinLength(7)
    @MaxLength(7)
    @ValidateNested()
    habitDays: boolean[]

    @IsOptional()
    @IsString()
    remindTime?: string

    @IsOptional()
    @IsArray()
    @MinLength(7)
    @MaxLength(7)
    @ValidateNested()
    remindDays?: boolean[]
  }
  