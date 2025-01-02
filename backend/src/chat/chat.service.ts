
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './message.schema';
import { UserService } from 'src/user-managment/user.service';
import { Course } from 'src/course-management/course.schema';
import { CourseService } from 'src/course-management/course.service';
import { Chat } from './chat.schema';
import { CreateMessageDto } from './createmsg.dto';
import { NotificationService } from 'src/notifications/notifications.service';
@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
    private readonly notificationService:NotificationService,
  ) {}

  async createCourseGroupChat(userId: string, courseId: string, groupName: string): Promise<Chat> {
    const user = await this.userService.getUserById(userId);
    const course = await this.courseService.getCourseById(courseId);
  
    if (!user || !course) {
      throw new NotFoundException('User or Course not found.');
    }
  
    let isInstructor = false;
    // First check if user is an instructor
    if (user.role === 'instructor') {
      // Only then check if they teach this specific course
      isInstructor = await this.userService.istheinstructorInCourse(courseId, userId);
    }
  
    // Check if the creator is enrolled in the course
    const isEnrolled = await this.userService.isStudentEnrolledInCourse(courseId, userId);
  
    if (!isEnrolled && !isInstructor) {
      throw new BadRequestException('Creator must be enrolled in or teaching the course to create a group chat.');
    }
  
    const existingChats = await this.chatModel.find({ courseId });
  
    const chat = await this.chatModel.create({
      chatId: `course-${courseId}-${existingChats.length + 1}`,
      chatType: 'course',
      participants: [userId],
      courseId,
      groupName: groupName,
    });
  
    return chat;
  }

  async createOneToOneChat(userId1: string, userId2: string, courseId: string): Promise<Chat> {
    const user1 = await this.userService.getUserById(userId1);
    const user2 = await this.userService.getUserById(userId2);

    if (!user1 || !user2) {
      throw new NotFoundException('One or more users not found.');
    }

    // Check if both users are enrolled in the same course
    const user1Enrolled = await this.userService.isStudentEnrolledInCourse(courseId, userId1);
   
   

    if(user2.role==='instructor'||user2.role==='admin'){
      throw new BadRequestException('canot invite this user to chat');}
    else{
      const user2Enrolled = await this.userService.isStudentEnrolledInCourse(courseId, userId2);
    
  
    if ((!user1Enrolled ) || (!user2Enrolled )) {
      throw new BadRequestException('Both users must be enrolled in or teaching the same course.');
    }

    const chatId = [userId1, userId2].sort().join('-');

    const existingChat = await this.chatModel.findOne({ chatId });
    if (existingChat) {
      return existingChat;
    }

    const chat = await this.chatModel.create({
      chatId,
      chatType: 'one-to-one',
      participants: [userId1, userId2],
      courseId, // Add courseId to the chat
    });

    return chat;
  }}

  async createStudyGroupChat(
    creatorId: string,
    groupName: string,
    participantIds: string[],
    courseId: string,
  ): Promise<Chat> {
    const creator = await this.userService.getUserById(creatorId);
    const course = await this.courseService.getCourseById(courseId);
  
    if (!creator || !course) {
      throw new NotFoundException('Creator or course not found.');
    }
  
    // Check if the creator is either enrolled in the course (student) or teaching the course (instructor)
    const isCreatorEligible =
      (creator.role === 'student' && (await this.userService.isStudentEnrolledInCourse(courseId, creatorId))) ||
      (creator.role === 'instructor' && (await this.userService.istheinstructorInCourse(courseId, creatorId)));
  
    if (!isCreatorEligible) {
      throw new BadRequestException('Creator must be enrolled in or teaching the course.');
    }
  
    // Validate all participants
    for (const participantId of participantIds) {
      const participant = await this.userService.getUserById(participantId);
  
      if (!participant) {
        throw new BadRequestException(`Participant with ID ${participantId} not found.`);
      }
  
      if (participant.role === 'instructor' || participant.role === 'admin') {
        throw new BadRequestException(`Cannot add participant with role ${participant.role}.`);
      }
  
      const isParticipantEnrolled = await this.userService.isStudentEnrolledInCourse(courseId, participantId);
      if (!isParticipantEnrolled) {
        throw new BadRequestException(`Participant ${participantId} must be enrolled in the course.`);
      }
    }
  
    // Create the group chat
    const chat = await this.chatModel.create({
      chatId:groupName,
      chatType: 'group',
      participants: [creatorId, ...participantIds],
      groupName,
      courseId,
    });
  
    return chat;
  }
  

  async joinchat(userId: string, chatId: string): Promise<Chat> {
    const user = await this.userService.getUserById(userId);
    const chat = await this.chatModel.findOne({ chatId }).exec();

    if (!user || !chat) {
      throw new NotFoundException('User or Chat not found.');
    }
    let isEnrolled=false;
    let isInstructor=false;

   if(user.role==='student')
    isEnrolled = await this.userService.isStudentEnrolledInCourse(chat.courseId, userId);
   if(user.role==='instructor')
    isInstructor = await this.userService.istheinstructorInCourse(chat.courseId, userId);

    if (!isEnrolled && !isInstructor) {
      throw new BadRequestException('User must be enrolled in or teaching the course to join the chat.');
    }

    if (!chat.participants.includes(userId)) {
      chat.participants.push(userId);
      await chat.save();
    }

    return chat;
  }




  async saveMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { chatId, senderId, content, role } = createMessageDto;

    const chat = await this.chatModel.findOne({ chatId }).exec();
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found.`);
    }

    const message = await this.messageModel.create({
      chatId,
      senderId,
      content,
      role,
      timestamp: new Date(),
      isDeleted: false,
    });

    chat.messages.push(message._id as Types.ObjectId);
    await chat.save();
    const notificationMessage = `You have a new message from ${senderId}`;
    await this.notificationService.createNotification( senderId, notificationMessage, 'message');

    return message;
  }

  async saveOneToOneMessage(
    userId1: string,
    userId2: string,
    content: string,
    senderId: string,
    role: 'student' | 'instructor',
  ): Promise<Message> {
    const chatId = [userId1, userId2].sort().join('-');
    const chat = await this.chatModel.findOne({ chatId });

    if (!chat) {
      throw new NotFoundException(`Chat between users not found.`);
    }

    const message = await this.messageModel.create({
      chatId,
      senderId,
      content,
      role,
      timestamp: new Date(),
      isDeleted: false,
    });

    chat.messages.push(message._id as Types.ObjectId);
    await chat.save();
    const notificationMessage = `You have a new message from ${senderId}`;
    await this.notificationService.createNotification( senderId, notificationMessage, 'message');

    return message;
  }





  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) {
      throw new NotFoundException('Message not found.');
    }
    const chatId=message.chatId;

    const chat = await this.chatModel.findOne({chatId}).exec();
    if (!chat) {
      throw new NotFoundException('Chat not found.');
    }

    // Check if the user is a participant of the chat or the sender of the message
    if (!chat.participants.includes(userId) && message.senderId !== userId) {
      throw new BadRequestException('User is not authorized to delete this message.');
      
    }

    message.isDeleted=true;
    await message.save(); 
    return true;
  }

  async deleteChat(chatId: string, userId: string): Promise<boolean> {
    const chat = await this.chatModel.findOne({ chatId }).exec();
    const user = await this.userService.getUserById(userId);
  
    if (!chat) {
      throw new NotFoundException('Chat not found.');
    }
  
    if (!user) {
      throw new NotFoundException('User not found.');
    }
  
    // Check if the user is an instructor or admin of the course
    let isInstructorOrAdmin = false;
  
    // Check if user is an instructor or admin (not 'student')
    if (user.role === 'instructor') {
      isInstructorOrAdmin = await this.userService.istheinstructorInCourse(chat.courseId, userId);
    } else if (user.role === 'admin') {
      isInstructorOrAdmin = true;  // Admin can delete any chat
    }
  
    if (!isInstructorOrAdmin) {
      throw new BadRequestException('Only the instructor of this course or admins can delete this chat.');
    }
  
    // Deactivate the chat if the user is authorized
    chat.isActive = false;
    await chat.save();  // Save the changes to the database
  
    return true;
  }
  
  
// const userObjectId = new Types.ObjectId(userId);
  

  
  
} 
  


