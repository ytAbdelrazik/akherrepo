import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Course } from './course.schema';
import { User } from 'src/user-managment/users.schema';
export type StudentDocument = Student & Document;

@Schema()
export class Student extends User {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: true, default: [] })
  enrolledCourses: Course[];

  @Prop({ default: Date.now })
  createdAt: Date;

 @Prop({
    type: [
      {
        courseId: { type: String, required: true }, // Course ID
        completionDate: { type: Date, required: true }, // When the course was completed
        score: { type: Number, required: true }, // Score achieved in the course
      },
    ],
    default: [],
  })
  completedCourses: {
    courseId: string;
    completionDate: Date;
    score: number;
  }[]; // List of completed courses with metadata

}

export const StudentSchema = SchemaFactory.createForClass(Student);
