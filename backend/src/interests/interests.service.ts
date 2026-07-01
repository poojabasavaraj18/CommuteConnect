import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterestsService {
  constructor(private readonly prisma: PrismaService) {}

  async expressInterest(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.ownerId === userId) {
      throw new ForbiddenException(
        'You cannot express interest in your own post',
      );
    }

    const existingInterest =
      await this.prisma.interest.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

    if (existingInterest) {
      throw new BadRequestException(
        'Interest already exists',
      );
    }

    return this.prisma.interest.create({
      data: {
        userId,
        postId,
      },
    });
  }

  async myInterests(userId: string) {
    return this.prisma.interest.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            owner: true,
          },
        },
      },
    });
  }

  async receivedInterests(userId: string) {
    return this.prisma.interest.findMany({
      where: {
        post: {
          ownerId: userId,
        },
      },
      include: {
        user: true,
        post: true,
      },
    });
  }

  async removeInterest(userId: string, postId: string) {
    const interest =
      await this.prisma.interest.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

    if (!interest) {
      throw new NotFoundException(
        'Interest not found',
      );
    }

    await this.prisma.interest.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return {
      message: 'Interest removed successfully',
    };
  }
}