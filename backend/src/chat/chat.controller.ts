
import { Controller, Post, Body, Param, NotFoundException, BadRequestException, Delete, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './message.schema';
import { Chat } from './chat.schema';
import { CreateMessageDto } from './createmsg.dto';
import { RolesGuard } from 'src/user-managment/roles.guard';
import { UseGuards } from '@nestjs/common';
@Controller('chat')
@UseGuards(RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Create a new course chat group.
   */
  @Post('course/:courseId/group')
  async createCourseGroupChat(
    @Body('userId') userId: string,
    @Param('courseId') courseId: string,
    @Body('groupName') groupName: string,
  ): Promise<Chat> {
    if (!userId || !courseId || !groupName) {
      throw new BadRequestException('userId, courseId, and groupName are required.');
    }

    const chat = await this.chatService.createCourseGroupChat(userId, courseId, groupName);
    if (!chat) {
      throw new NotFoundException(`Failed to create group chat for course ${courseId}.`);
    }
    return chat;
  }

  /**
   * Create a new one-to-one chat between two users.
   */
  @Post('course/:courseId/one-to-one')
  async createOneToOneChat(
    @Body('userId1') userId1: string,
    @Body('userId2') userId2: string,
    @Param('courseId') courseId: string,
  ): Promise<Chat> {
    if (!userId1 || !userId2 || !courseId) {
      throw new BadRequestException('userId1, userId2, and courseId are required.');
    }

    const chat = await this.chatService.createOneToOneChat(userId1, userId2, courseId);
    if (!chat) {
      throw new NotFoundException('One-to-one chat creation failed.');
    }
    return chat;
  }

  /**
   * Create a study group chat.
   */
  @Post('course/:courseId/study-group')
  async createStudyGroupChat(
    @Body('creatorId') creatorId: string,
    @Body('groupName') groupName: string,
    @Body('participantIds') participantIds: string[],
    @Param('courseId') courseId: string,
  ): Promise<Chat> {
    if (!creatorId || !groupName || !participantIds || !courseId) {
      throw new BadRequestException('creatorId, groupName, participantIds, and courseId are required.');
    }

    return this.chatService.createStudyGroupChat(creatorId, groupName, participantIds, courseId);
  }

  /**
   * Send a message in a one-to-one chat.
   */
  @Post('one-to-one/:userId1/:userId2/message')
  async sendMessage(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
    @Body('content') content: string,
    @Body('role') role: 'student' | 'instructor',
  ): Promise<Message> {

    if(userId1)
    if (!content) {
      throw new BadRequestException('content is required.');
    }

  

    const savedMessage = await this.chatService.saveOneToOneMessage(
      userId1,
      userId2,
      content,
      userId1,
      role,
    );
    
    if (!savedMessage) {
      throw new NotFoundException('Failed to send message.');
    }
    return savedMessage;
  }

  /**
   * Save a new message for a course chat.
   */
  @Post('message/:chatId')
  async saveMessage(
    @Param('chatId') chatId: string,
    @Body('senderId') senderId: string,
    @Body('content') content: string,
    @Body('role') role: 'student' | 'instructor',
  ): Promise<Message> {
    if (!senderId || !content || !role) {
      throw new BadRequestException('senderId, content, and role are required.');
    }

    const createMessageDto: CreateMessageDto = {
      chatId,
      senderId,
      content,
      role,
    };

    const savedMessage = await this.chatService.saveMessage(createMessageDto);
    if (!savedMessage) {
      throw new NotFoundException('Failed to save message.');
    }
    return savedMessage;
  }

  /**
   * Join an existing course chat.
   */
  @Post('join')
  async joinChat(
    @Body('chatId') chatId: string,
    @Body('userId') userId: string,
  ): Promise<Chat> {
    if (!userId || !chatId) {
      throw new BadRequestException('userId and chatId are required to join a chat.');
    }

    const chat = await this.chatService.joinchat(userId, chatId);
    return chat;
  }

  

  @Delete('message/:messageId')
  async deleteMessage(
    @Param('messageId') messageId: string,
    @Body() body: { userId: string }  // Extract userId from body
  ): Promise<{ message: string }> {
    const { userId } = body;
    
    const isDeleted = await this.chatService.deleteMessage(messageId, userId);
    if (!isDeleted) {
      throw new NotFoundException(`Message with ID ${messageId} not found.`);
    }
    return { message: 'Message deleted successfully.' };
  }
  
  @Delete(':chatId')
  async deleteChat(
    @Param('chatId') chatId: string,
    @Body() body: { userId: string }  // Extract userId from body
  ): Promise<{ message: string }> {
    const { userId } = body;
    
    const isDeleted = await this.chatService.deleteChat(chatId, userId);
    if (!isDeleted) {
      throw new NotFoundException(`Chat with ID ${chatId} not found.`);
    }
    return { message: 'Chat deleted successfully.' };
  }

  @Get(':chatId/messages')
async getMessages(
  @Param('chatId') chatId: string,
  @Query('lastMessageId') lastMessageId?: string,
) {
  return this.chatService.getMessages(chatId, lastMessageId);
}
  
}


