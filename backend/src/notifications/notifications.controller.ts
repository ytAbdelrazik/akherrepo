import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { NotificationService } from '../notifications/notifications.service';
import { Notification } from 'src/notifications/notifications.schema';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Endpoint to create a new notification
  @Post()
  async createNotification(
    @Body('userId') userId: string,
    @Body('message') message: string,
    @Body('type') type: string,
  ): Promise<Notification> {
    return this.notificationService.createNotification(userId, message, type);
  }

  // Endpoint to get unread notifications for a user
  @Get('unread/:userId')
  async getUnreadNotifications(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationService.getUnreadNotifications(userId);
  }

  // Endpoint to mark a notification as read
  @Patch('mark-as-read/:id')
  async markAsRead(@Param('id') notificationId: string): Promise<Notification> {
    return this.notificationService.markAsRead(notificationId);
  }
}
