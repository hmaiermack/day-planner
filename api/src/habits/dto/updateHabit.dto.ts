import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateNested,
  } from 'class-validator';
  
  export class UpdateHabitDto {

    @IsNumber()
    id: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray()
    @MinLength(7)
    @MaxLength(7)
    @ValidateNested()
    habitDays?: boolean[];

    @IsOptional()
    @IsString()
    remindTime?: string;

    @IsOptional()
    @IsArray()
    @MinLength(7)
    @MaxLength(7)
    @ValidateNested()
    remindDays?: boolean[];
  }
  