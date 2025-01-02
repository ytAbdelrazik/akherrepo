import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Progress extends Document {
  @Prop({ required: true, unique: true })
  progressId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  completionPercentage: number;

  @Prop({ required: true })
  lastAccessed: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
