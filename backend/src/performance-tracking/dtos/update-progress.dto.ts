import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class UpdateProgressDto {
  @IsNotEmpty()
  @IsString()
  progressId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsNumber()
  completionPercentage: number;

  @IsNotEmpty()
  @IsDateString()
  lastAccessed: Date;
}

export class CreateProgressDto {
  @IsNotEmpty()
  @IsString()
  userId: string;  // Assuming userId is required for creating progress

  @IsNotEmpty()
  @IsString()
  courseId: string;  // Assuming courseId is required for creating progress

  @IsNotEmpty()
  @IsNumber()
  completionPercentage: number;

  @IsNotEmpty()
  @IsDateString()
  lastAccessed: Date;  // Date when the progress was last accessed
}
