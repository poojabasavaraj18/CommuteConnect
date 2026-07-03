import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationsService } from './notification.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [NotificationsService],
  exports: [NotificationsService], // needed so Interests/Posts modules can use it
})
export class NotificationsModule {}