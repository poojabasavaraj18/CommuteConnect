import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsQueryDto } from './dto/get-posts-query.dto/get-posts-query.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto/update-post-status.dto';
import { NotificationsService } from '../notifications/notification.service';
import { NotificationType, PostStatus } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        origin: dto.origin,
        destination: dto.destination,
        travelDate: new Date(dto.travelDate),
        travelTime: dto.travelTime,
        availableSeats: dto.availableSeats,
        notes: dto.notes,
        ownerId: userId,
      },
    });
  }

  async findAll(query: GetPostsQueryDto) {
    const { page, limit, origin, destination, status, travelDate } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (origin) {
      where.origin = {
        contains: origin,
      };
    }

    if (destination) {
      where.destination = {
        contains: destination,
      };
    }

    if (status) {
      where.status = status;
    }

    if (travelDate) {
      const start = new Date(travelDate);
      const end = new Date(travelDate);
      end.setDate(end.getDate() + 1);

      where.travelDate = {
        gte: start,
        lt: end,
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.post.count({
        where,
      }),
    ]);

    return {
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findMyPosts(userId: string) {
    return this.prisma.post.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updated = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...dto,
        travelDate: dto.travelDate ? new Date(dto.travelDate) : undefined,
      },
    });

    await this.notifyInterestedUsers(
      postId,
      'Ride details have been updated.',
      NotificationType.POST_UPDATED,
    );

    return updated;
  }

  async updateStatus(
    postId: string,
    userId: string,
    dto: UpdatePostStatusDto,
  ) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updated = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: dto.status,
      },
    });

    if (dto.status === PostStatus.COMPLETED) {
      await this.notifyInterestedUsers(
        postId,
        'Ride has been completed.',
        NotificationType.POST_COMPLETED,
      );
    }

    return updated;
  }

  async delete(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return {
      message: 'Post deleted successfully',
    };
  }

  // Notifies every user who expressed interest in this post.
  // Used for POST_UPDATED and POST_COMPLETED events.
  private async notifyInterestedUsers(
    postId: string,
    message: string,
    type: NotificationType,
  ) {
    const interests = await this.prisma.interest.findMany({
      where: { postId },
      select: { userId: true },
    });

    await Promise.all(
      interests.map((i) =>
        this.notificationsService.createNotification({
          userId: i.userId,
          message,
          type,
        }),
      ),
    );
  }
}