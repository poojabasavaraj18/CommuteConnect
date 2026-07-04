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
  const {
    page = 1,
    limit = 10,
    origin,
    destination,
    status,
    travelDate,
  } = query;

  const where: any = {};

  // Status stays a hard filter — a COMPLETED ride is genuinely not what's being asked for
  if (status && status.trim() !== '') {
    where.status = status;
  }

  const hasOrigin = origin && origin.trim() !== '';
  const hasDestination = destination && destination.trim() !== '';

  // Route filter: match the requested direction OR the reverse direction.
  // (Bangalore->Mysore search will also surface Mysore->Bangalore posts,
  // ranked lower — handled below.)
  if (hasOrigin || hasDestination) {
    const forward: any = {};
    if (hasOrigin) forward.origin = { contains: origin!.trim(), mode: 'insensitive' };
    if (hasDestination) forward.destination = { contains: destination!.trim(), mode: 'insensitive' };

    const reverse: any = {};
    if (hasOrigin) reverse.destination = { contains: origin!.trim(), mode: 'insensitive' };
    if (hasDestination) reverse.origin = { contains: destination!.trim(), mode: 'insensitive' };

    where.OR = [forward, reverse];
  }

  // NOTE: travelDate is intentionally NOT applied as a DB filter here.
  // We fetch all route-matching posts and rank by date closeness in JS,
  // so a search for a date with no exact matches still returns the
  // nearest available rides instead of an empty result.

  const allMatches = await this.prisma.post.findMany({
    where,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const requestedDate = travelDate ? new Date(travelDate) : null;

  const scored = allMatches.map((post) => {
    let dateScore = 0;
    if (requestedDate) {
      const diffMs = Math.abs(post.travelDate.getTime() - requestedDate.getTime());
      dateScore = Math.round(diffMs / (1000 * 60 * 60 * 24)); // difference in days
    }

    // Exact direction match ranks above the reversed direction
    const isReversed =
      hasOrigin &&
      hasDestination &&
      post.origin.toLowerCase().includes(destination!.trim().toLowerCase()) &&
      post.destination.toLowerCase().includes(origin!.trim().toLowerCase());

    return { post, dateScore, isReversed };
  });

  scored.sort((a, b) => {
    // 1. Exact direction before reversed direction
    if (a.isReversed !== b.isReversed) return a.isReversed ? 1 : -1;
    // 2. Closer date first
    if (a.dateScore !== b.dateScore) return a.dateScore - b.dateScore;
    // 3. Most recently posted first
    return b.post.createdAt.getTime() - a.post.createdAt.getTime();
  });

  const total = scored.length;
  const start = (page - 1) * limit;
  const paged = scored.slice(start, start + limit).map((s) => s.post);

  return {
    data: paged,
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
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // General edits: origin, destination, time, seats, notes, etc.
  // Always fires POST_UPDATED — not tied to status changes.
  async update(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...dto,
        travelDate: dto.travelDate ? new Date(dto.travelDate) : undefined,
      },
    });

    await this.notifyInterestedUsers(
      postId,
      `Your ride from ${post.origin} to ${post.destination} has been updated.`,
      NotificationType.POST_UPDATED,
    );

    return updated;
  }

  // Dedicated status-only endpoint. Fires POST_COMPLETED only when
  // the ride is explicitly marked completed.
  async updateStatus(
    postId: string,
    userId: string,
    dto: UpdatePostStatusDto,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: { status: dto.status },
    });

    if (dto.status === PostStatus.COMPLETED) {
      await this.notifyInterestedUsers(
        postId,
        `Your ride from ${post.origin} to ${post.destination} has been marked completed.`,
        NotificationType.POST_COMPLETED,
      );
    }

    return updated;
  }

  async delete(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return { message: 'Post deleted successfully' };
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