import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course, CourseSchema } from './course.schema';
import { StudentSchema } from './student.schema'; // Import StudentSchema
import { InstructorSchema } from './instructor.schema'; // Import InstructorSchema
import { UsersModule } from 'src/user-managment/users.module';
import { UserService } from 'src/user-managment/user.service';
import { Discussion,DiscussionSchema } from './discussions/discussions.schema';
@Module({
  imports: [
    
    MongooseModule.forFeature([
      { name: 'Course', schema: CourseSchema },
      
      { name: 'Student', schema: StudentSchema, collection: 'students' }, // Register Student schema
      { name: 'Instructor', schema: InstructorSchema, collection: 'instructors'},
      {name:'Discussion',schema: DiscussionSchema,
       },
       // Register Instructor schema
    ]),
    forwardRef(() => UsersModule)


  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [MongooseModule,CourseService], // Export MongooseModule for reuse in other modules
})
export class CourseModule {}
