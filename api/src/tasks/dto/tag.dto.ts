import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  colorHexValue: string;
}
