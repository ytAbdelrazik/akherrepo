import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionsService } from './discussions.service';
import { DiscussionsController } from './discussions.controller';
import { Discussion, DiscussionSchema } from './discussions.schema';
import { Comment, CommentSchema } from './comments.schema';
import { Notification, NotificationSchema } from '../../notifications/notifications.schema';
import { NotificationService } from '../../notifications/notifications.service';
import { Course, CourseSchema } from '../course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discussion.name, schema: DiscussionSchema }, // Register Discussion schema
      { name: Comment.name, schema: CommentSchema },       // Register Comment schema
      { name: Notification.name, schema: NotificationSchema }, // Register Notification schema
      { name: Course.name, schema: CourseSchema }, // Register Course schema for integration
    ]),
  ],
  controllers: [DiscussionsController], // Declare the controller here
  providers: [DiscussionsService, NotificationService], // Include necessary services
  exports: [DiscussionsService], // Export only the service if needed in other modules
})
export class DiscussionsModule {}