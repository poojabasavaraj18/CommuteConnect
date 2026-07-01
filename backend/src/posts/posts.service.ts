import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll() {
    return this.prisma.post.findMany({
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
    });
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

  async update(
    userId: string,
    postId: string,
    dto: UpdatePostDto,
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
      throw new ForbiddenException(
        'You can only update your own posts',
      );
    }

    return this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...dto,
        travelDate: dto.travelDate
          ? new Date(dto.travelDate)
          : undefined,
      },
    });
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
      throw new ForbiddenException(
        'You can only delete your own posts',
      );
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
}