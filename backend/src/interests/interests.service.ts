import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InterestStatus, NotificationType } from '@prisma/client';
import { NotificationsService } from '../notifications/notification.service';

@Injectable()
export class InterestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async expressInterest(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.ownerId === userId) {
      throw new ForbiddenException(
        'You cannot express interest in your own post',
      );
    }

    const existingInterest = await this.prisma.interest.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existingInterest) {
      throw new BadRequestException('Interest already exists');
    }

    const interest = await this.prisma.interest.create({
      data: { userId, postId },
    });

    const interestedUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    await this.notificationsService.createNotification({
      userId: post.ownerId,
      message: `${interestedUser?.name ?? 'Someone'} is interested in your ride from ${post.origin} to ${post.destination}.`,
      type: NotificationType.INTEREST_RECEIVED,
      referenceId: interest.id,
    });

    return interest;
  }

  async myInterests(userId: string) {
    return this.prisma.interest.findMany({
      where: { userId },
      include: { post: { include: { owner: true } } },
    });
  }

  async receivedInterests(userId: string) {
    return this.prisma.interest.findMany({
      where: { post: { ownerId: userId } },
      include: { user: true, post: true },
    });
  }

  async updateStatus(
    interestId: string,
    userId: string,
    status: InterestStatus,
  ) {
    const interest = await this.prisma.interest.findUnique({
      where: { id: interestId },
      include: {
        post: { include: { owner: true } },
        user: true,
      },
    });

    if (!interest) {
      throw new NotFoundException('Interest not found');
    }

    if (interest.post.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only respond to interests on your own rides',
      );
    }

    const updated = await this.prisma.interest.update({
      where: { id: interestId },
      data: { status },
    });

    const ownerName = interest.post.owner?.name ?? 'The ride owner';
    const routeText = `${interest.post.origin} to ${interest.post.destination}`;

    if (status === InterestStatus.ACCEPTED) {
      await this.notificationsService.createNotification({
        userId: interest.userId,
        message: `${ownerName} accepted your interest for the ride from ${routeText}.`,
        type: NotificationType.INTEREST_ACCEPTED,
      });
    } else if (status === InterestStatus.REJECTED) {
      await this.notificationsService.createNotification({
        userId: interest.userId,
        message: `${ownerName} rejected your interest for the ride from ${routeText}.`,
        type: NotificationType.INTEREST_REJECTED,
      });
    }

    return updated;
  }

  async removeInterest(userId: string, postId: string) {
    const interest = await this.prisma.interest.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (!interest) {
      throw new NotFoundException('Interest not found');
    }

    await this.prisma.interest.delete({
      where: { userId_postId: { userId, postId } },
    });

    return { message: 'Interest removed successfully' };
  }
}