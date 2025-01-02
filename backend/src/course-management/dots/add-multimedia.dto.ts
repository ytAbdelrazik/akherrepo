import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddMultimediaDto {
  @IsEnum(['video', 'pdf', 'image'])
  @IsNotEmpty()
  resourceType: 'video' | 'pdf' | 'image';

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  uploadedAt?: Date;
}
