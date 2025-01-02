import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionBankDocument = QuestionBank & Document;

@Schema()
export class QuestionBank {
  @Prop({ required: true, unique: true })
  moduleId: string;

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        answer: { type: String, required: true },
        type: { type: String, enum: ['MCQ', 'TF'], required: true },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
      },
    ],
    default: [],
  })
  questions: {
    question: string;
    options: string[];
    answer: string;
    type: 'MCQ' | 'TF';
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
}



export const QuestionBankSchema = SchemaFactory.createForClass(QuestionBank);




