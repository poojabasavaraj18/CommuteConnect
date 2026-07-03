import { Module } from '@nestjs/common';
import { InterestsController } from './interests.controller';
import { InterestsService } from './interests.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notification.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [InterestsController],
  providers: [InterestsService],
})
export class InterestsModule {}