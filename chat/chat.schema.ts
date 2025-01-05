import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ unique: true })
  chatId: string;

  @Prop({ required: true, enum: ['one-to-one', 'group', 'course'] })
  chatType: string;

  @Prop({ type: [String], required: true })  // Changed from Types.ObjectId[] to String[]
  participants: string[];

  @Prop({ String, required: false })
  courseId?: string

  @Prop({ type: String, required: false })
  title?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Message', default: [] })
  messages: Types.ObjectId[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

