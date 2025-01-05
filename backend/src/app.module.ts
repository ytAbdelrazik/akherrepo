import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './user-managment/users.module';
import { ResponsesModule } from './interactive-modules/responses.module';
import { InteractionModule } from './recommedation-engine/user-interaction.module';
import { RecommendationModule } from './recommedation-engine/recommendation.module';
import { PerformanceTrackingModule } from './performance-tracking/performance-tracking.module';
import { InteractiveModulesModule } from './interactive-modules/quizzes.module';
import { CourseModule } from './course-management/course.module';
import { ModuleModule } from './course-management/module.module';
import { AuthModule } from './user-managment/auth.module';
import { FailedLoginSchema } from './user-managment/failed-login.schema';
import { User, UserSchema } from './user-managment/users.schema';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './user-managment/roles.guard';
import { Reflector } from '@nestjs/core';
import { ChatModule } from './chat/chat.module';
import { CourseSchema } from './course-management/course.schema'
import { QuickNotesModule } from './quick-notes/notes.module';
import { BackupModule } from './backup/backup.module';
import { QuestionBankModule } from './interactive-modules/question-bank.module';

import { DiscussionsModule } from './course-management/discussions/discussions.module'; // Add this
import { NotificationModule } from './notifications/notification.module';


@Module({
  imports: [
    // Database connection
    MongooseModule.forRoot('mongodb+srv://ahmed:ahmed2006@cluster0.l8ikh.mongodb.net'),

    // Feature modules
    UsersModule,
    InteractionModule,
    RecommendationModule,
    PerformanceTrackingModule,
    ModuleModule,
    InteractiveModulesModule,
    CourseModule,
    AuthModule,
    ChatModule,
    QuickNotesModule, // Ensure this is correctly imported

    BackupModule,
    QuestionBankModule,
    ResponsesModule,
    DiscussionsModule,
    NotificationModule,


    // Schemas
    MongooseModule.forFeature([
      { name: 'FailedLogin', schema: FailedLoginSchema },
      { name: User.name, schema: UserSchema },
     
    ]),

    // JWT Module
    JwtModule.register({
      secret: 'ahmed', // Replace with a secure secret key
      signOptions: { expiresIn: '1h' },
    }),
    
  ],
  controllers: [],
  providers: [
    RolesGuard,
    Reflector,
    

  ],
})
export class AppModule {}