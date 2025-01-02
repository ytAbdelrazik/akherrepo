import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Message } from 'src/chat/message.schema';
export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true, unique: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ default: true }) // for when made unavaiilable by instructor or admin
  isAvailable: boolean;
   
  @Prop({ type: [String], default: [] })
  messages: string[]; 


  @Prop({ type: [String], required: false }) // New field for keywords
  keywords?: string[]; 




  // Multimedia resources related to the course
  @Prop({
    type: [
      {
        resourceType: { type: String, enum: ['video', 'pdf', 'image'], required: true },
        url: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  multimedia: Array<{
    [x: string]: any;
    resourceType: 'video' | 'pdf' | 'image';
    url: string;
    title: string;
    description?: string;
    uploadedAt: Date;
  }>;

  // Versions of the course content
  @Prop({
    type: [
      {
        version: { type: String, required: true },
        content: { type: Object, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  versions: Array<{
    version: string;
    content: Record<string, any>;
    updatedAt: Date;
    uploadedAt?: Date; // Optional field
  }>;

  // Chat room feature for the course
  @Prop({
    type: [
      {
        sender: { type: Types.ObjectId, ref: 'User', required: true }, // User (Student or Instructor) sending the message
        message: { type: String, required: true }, // The content of the message
        timestamp: { type: Date, default: Date.now }, // Timestamp when the message is sent
        role: { type: String, enum: ['student', 'instructor'], required: true }, // Sender's role (student/instructor)
      },
    ],
    default: [],
  })
  chatRoom: Array<{
   message:Message;
  }>;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// Add indexes to optimize queries
CourseSchema.index({ title: 'text', category: 'text', createdBy: 'text' }); // Text index for searching
CourseSchema.index({ category: 1 }); // Single field index for filtering by category
CourseSchema.index({ 'chatRoom.timestamp': -1 }); // Index on chat messages timestamp to optimize recent message fetching
