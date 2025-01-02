import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user-managment/users.schema';
import { Course } from './course.schema';

export type InstructorDocument = Instructor & Document;

@Schema()
export class Instructor extends User{
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  expertise: string[];

  @Prop({ required: true, default: [] })
  createdCourses: Course[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const InstructorSchema = SchemaFactory.createForClass(Instructor);
