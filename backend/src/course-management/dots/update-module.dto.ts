import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class UpdateModuleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsOptional()
  resources?: string[];
}
