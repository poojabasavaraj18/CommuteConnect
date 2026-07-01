import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    // Logged-in user
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Statistics
    const totalPosts = await this.prisma.post.count({
      where: {
        ownerId: userId,
      },
    });

    const activePosts = await this.prisma.post.count({
      where: {
        ownerId: userId,
        status: 'ACTIVE',
      },
    });

    const interestsSent = await this.prisma.interest.count({
      where: {
        userId,
      },
    });

    const interestsReceived = await this.prisma.interest.count({
      where: {
        post: {
          ownerId: userId,
        },
      },
    });

    // Recent Posts
    const recentPosts = await this.prisma.post.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // Recent Interests Received
    const recentReceivedInterests =
      await this.prisma.interest.findMany({
        where: {
          post: {
            ownerId: userId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          post: {
            select: {
              id: true,
              origin: true,
              destination: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      });

    return {
      user,
      stats: {
        totalPosts,
        activePosts,
        interestsSent,
        interestsReceived,
      },
      recentPosts,
      recentReceivedInterests,
    };
  }
}