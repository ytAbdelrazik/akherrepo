import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Discussion extends Document {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ['student', 'instructor'] })
  role: string;

  @Prop({ required: true }) // Add the title field
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);