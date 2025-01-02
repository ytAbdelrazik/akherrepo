import { Module } from '@nestjs/common';


import { MongooseModule } from '@nestjs/mongoose';  // Import MongooseModule
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserService } from 'src/user-managment/user.service';
import { CourseService } from 'src/course-management/course.service';
import { Course, CourseSchema } from 'src/course-management/course.schema';
import { User, UserSchema } from 'src/user-managment/users.schema';
import { Chat, ChatSchema } from './chat.schema';
import { Message, MessageSchema } from './message.schema';  // Import Message schema
import { Student, StudentSchema } from 'src/course-management/student.schema';
import { Instructor, InstructorSchema } from 'src/course-management/instructor.schema';
import { Admin } from 'mongodb';
import { AdminSchema } from 'src/user-managment/admin.schema';
import { NotificationService } from 'src/notifications/notifications.service';
import { Notification, NotificationSchema } from 'src/notifications/notifications.schema';

//import { ChatGateway } from './chat.gateway';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },  // Register Message model here
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Instructor.name, schema: InstructorSchema },
      {name:Admin.name,schema:AdminSchema},
      {name:Notification.name,schema:NotificationSchema}

    ]),
  ],
  providers: [ChatService, CourseService, UserService,NotificationService],//ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}




