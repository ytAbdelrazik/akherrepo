import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiscussionDto {
  @IsString()
  @IsNotEmpty()
  content: string; // The discussion content
}