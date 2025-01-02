import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz, QuizSchema } from './quizzes.schema';
import { ModuleSchema } from '../course-management/module.schema';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from '../user-managment/roles.guard';
import { Reflector } from '@nestjs/core';
import { QuestionBankSchema } from './questionsbank.schema';
import { ResponseSchema } from './responses.schema';
import { StudentSchema } from '../course-management/student.schema';
import { CourseSchema } from '../course-management/course.schema'; // Import CourseSchema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: 'QuestionBank', schema: QuestionBankSchema },
      { name: 'Response', schema: ResponseSchema },
      { name: 'Student', schema: StudentSchema },
      { name: 'Course', schema: CourseSchema }, // Register Course schema
    ]),
    JwtModule.register({
      secret: 'ahmed', // Replace with your secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService, RolesGuard, Reflector], // Ensure all dependencies are provided
  exports: [QuizzesService], // Export if needed elsewhere
})
export class InteractiveModulesModule {}
