import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  userId: string;  // The recipient of the notification

  @Prop({ required: true })
  message: string;  // The notification message

  @Prop({ default: false })
  isRead: boolean;  // Flag to indicate if the notification is read

  @Prop({ required: true })
  type: string;  // Type of notification, e.g., 'message' or 'system'

  @Prop({ default: Date.now })
  timestamp: Date;  // The time the notification was created

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
