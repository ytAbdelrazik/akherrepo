import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class InstructorRating extends Document {
  @Prop({ type: String, required: true, ref: 'User' })
  userId: String;

  @Prop({ type: String, required: true, ref: 'Instructor' })
  instructorId: String;

  @Prop({ type: String, ref: 'Course' })
  courseId?: String; // Optional: To track which course the rating is associated with.

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const InstructorRatingSchema = SchemaFactory.createForClass(InstructorRating);
