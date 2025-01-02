import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema()
export class Quiz {
  @Prop({ required: true, unique: true })
  quizId: string;

  @Prop({ required: true })
  moduleId: string;

  @Prop({
    type: [{ question: String, options: [String], answer: String, difficulty: String }],
    required: true,
  })
  questions: {
    question: string;
    options: string[];
    answer: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }[];

  @Prop({ required: true })
  courseId: string; // Add courseId field

  @Prop({ required: true })
  questionType: 'MCQ' | 'TF' | 'both';

  @Prop({ required: true })
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';

  @Prop({ required: true })
  numberOfQuestions: number; // Include this field
  

  @Prop({ default: false })
  isAttempted: boolean; // Marks if the quiz has been taken by a student
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

