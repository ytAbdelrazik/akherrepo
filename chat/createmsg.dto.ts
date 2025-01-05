import { IsString, IsNotEmpty, IsEnum, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  chatId: string; // Ensure chatId is a valid MongoDB ObjectId

  @IsMongoId()
  senderId: string; // Ensure senderId is a valid MongoDB ObjectId

  @IsString()
  @IsNotEmpty()
  content: string; // Ensure content is a non-empty string

  @IsEnum(['student', 'instructor'])
  role: 'student' | 'instructor'; // Ensure role is either 'student' or 'instructor'
}