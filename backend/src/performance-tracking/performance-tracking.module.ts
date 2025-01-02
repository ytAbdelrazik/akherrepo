import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceTrackingController } from './performance-tracking.controller';
import { PerformanceTrackingService } from './performance-tracking.service';
import { Progress, ProgressSchema } from './progress.schema';
import { UserInteractionSchema, UserInteraction } from 'src/recommedation-engine/user-interaction.schema';
import { CourseModule } from 'src/course-management/course.module';  // Import the CourseModule
import { ModuleSchema } from 'src/course-management/module.schema';
import { ModuleModule } from 'src/course-management/module.module'; 
import { Quiz, QuizSchema } from 'src/interactive-modules/quizzes.schema';
import { Course, CourseSchema } from 'src/course-management/course.schema';
import { Rating, RatingSchema } from './modulerating.schema';
import { ResponseSchema } from 'src/interactive-modules/responses.schema';
import { User, UserSchema } from 'src/user-managment/users.schema';
import { InstructorRating, InstructorRatingSchema } from './instructorrating.schema';
import { JwtModule } from '@nestjs/jwt';
import { ResponsesService } from 'src/interactive-modules/responses.service';
import { ResponsesModule } from 'src/interactive-modules/responses.module';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: Progress.name, schema: ProgressSchema },
      { name: UserInteraction.name, schema: UserInteractionSchema },
      { name: Module.name, schema: ModuleSchema }, 
      { name: Course.name, schema: CourseSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: Response.name, schema: ResponseSchema },
      { name: User.name, schema: UserSchema },
      { name: InstructorRating.name, schema: InstructorRatingSchema }
    ]),
    CourseModule,
    ResponsesModule,
    ModuleModule,
    JwtModule.register({}), // Add this line
  ],
  controllers: [PerformanceTrackingController],
  providers: [PerformanceTrackingService],
})
export class PerformanceTrackingModule {}

