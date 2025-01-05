import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from 'src/notifications/notifications.service';

import { Notification, NotificationSchema } from './notifications.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}