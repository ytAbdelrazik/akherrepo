import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDiscussionDto {
  @IsString()
  @IsNotEmpty()
  content: string; // Updated discussion content
}