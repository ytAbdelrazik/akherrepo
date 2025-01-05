import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: String, required: true })
  chatId: String;

  @Prop({ type: String , ref: 'User', required: true })
  senderId: String;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, enum: ['student', 'instructor'], required: true })
  role: 'student' | 'instructor';

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;


}

export const MessageSchema = SchemaFactory.createForClass(Message);
