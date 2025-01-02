import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RolesGuard } from './roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { StudentSchema } from '../course-management/student.schema';
import { InstructorSchema } from '../course-management/instructor.schema';
import { UserSchema } from './users.schema';
import { FailedLoginSchema } from './failed-login.schema';
import { Reflector } from '@nestjs/core'; // Required for metadata reflection in guards
import { CourseSchema } from 'src/course-management/course.schema';
import { AdminSchema } from './admin.schema';
import { CourseService } from 'src/course-management/course.service';
import { CourseModule } from 'src/course-management/course.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name:'User',schema:UserSchema},
      { name: 'Student', schema: StudentSchema },      // Register Student schema
      { name: 'Instructor', schema: InstructorSchema }, // Register Instructor schema
      { name: 'FailedLogin', schema: FailedLoginSchema },
      {name:'Course',schema:CourseSchema},
      {name:'Admin',schema:AdminSchema} 
    ]),
    JwtModule.register({
      secret: 'ahmed', // Replace with your secure secret key
      signOptions: { expiresIn: '1h' }, // Token expiration
    }),
    forwardRef(() => CourseModule)
  ],
  controllers: [UserController], // Add user-related endpoints
  providers: [
    UserService,  // User service for handling business logic
    RolesGuard,   // Guard for role-based access control
    Reflector,
   
    // Reflector for metadata access in guards
  ],
  exports: [
    UserService, // Export UserService for use in other modules
    JwtModule,   // Export JwtModule for shared JWT functionality
  ],
})
export class UsersModule {}
