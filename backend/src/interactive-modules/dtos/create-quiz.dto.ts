import { IsString, IsNotEmpty, IsEnum, IsInt, Min } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  quizId: string;

  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsEnum(['easy', 'medium', 'hard'], { message: 'Difficulty must be easy, medium, or hard' })
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  courseId: string; // Add courseId field

  @IsInt()
  @Min(1)
  numberOfQuestions: number;

  @IsEnum(['MCQ', 'TF', 'both'], { message: 'Question type must be MCQ, TF, or both' })
  questionType: 'MCQ' | 'TF' | 'both';

  
}
