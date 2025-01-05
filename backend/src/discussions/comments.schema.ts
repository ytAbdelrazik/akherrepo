import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Comment extends Document {
  @Prop({ required: true }) // ID of the forum this comment belongs to
  forumId: string;

  @Prop({ required: true }) // ID of the user who created the comment
  userId: string;

  @Prop({ required: true, enum: ['student', 'instructor'] }) // Role of the user
  role: string;

  @Prop({ required: true }) // Comment content
  content: string;

  @Prop({ default: Date.now }) // Timestamp of comment creation
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);