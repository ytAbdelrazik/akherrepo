import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from 'src/notifications/notifications.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  // Create notification for user
  async createNotification(userId: string, message: string, type: string): Promise<Notification> {
    const notification = new this.notificationModel({
      userId,
      message,
      type,
    });
    return notification.save();
  }

  // Get unread notifications for a user
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId, isRead: false }).exec();
  }

  // Mark notifications as read
  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );

  }
}
