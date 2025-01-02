import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Rating extends Document {
  @Prop({ type: String, required: true, ref: 'User' })
  userId: String

  @Prop({ type: String, required: true, ref: 'Course' })
  courseId: String;

  @Prop({ type: String, ref: 'Module', default: null })
  moduleId?: String; // Optional, to track ratings for specific modules

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  
  
  
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
