import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FailedLoginDocument = FailedLogin & Document;

@Schema()
export class FailedLogin {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  reason: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const FailedLoginSchema = SchemaFactory.createForClass(FailedLogin);
