import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema({ timestamps: true })
export class Response {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  quizId: string;

  @Prop({
    type: [{ questionId: String, selectedOption: String, correct: Boolean }],
    required: true,
  })
  answers: { questionId: string; selectedOption: string; correct: boolean }[];

  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ required: true, default: false })
  isCompleted: boolean; // Indicates whether the quiz is fully attempted
  
  @Prop({ required: true })
  submittedAt: Date;

}

export const ResponseSchema = SchemaFactory.createForClass(Response);
