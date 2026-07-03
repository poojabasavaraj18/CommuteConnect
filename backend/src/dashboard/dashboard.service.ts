import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const start = Date.now();

    // Run all independent queries in parallel instead of one-by-one.
    // This cuts total wait time down to roughly the slowest single
    // query, instead of the sum of all of them.
    const [
      user,
      totalPosts,
      activePosts,
      interestsSent,
      interestsReceived,
      recentPosts,
      recentReceivedInterests,
    ] = await Promise.all([
      // Logged-in user
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),

      // Statistics
      this.prisma.post.count({
        where: {
          ownerId: userId,
        },
      }),

      this.prisma.post.count({
        where: {
          ownerId: userId,
          status: 'ACTIVE',
        },
      }),

      this.prisma.interest.count({
        where: {
          userId,
        },
      }),

      this.prisma.interest.count({
        where: {
          post: {
            ownerId: userId,
          },
        },
      }),

      // Recent Posts
      this.prisma.post.findMany({
        where: {
          ownerId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      }),

      // Recent Interests Received
      this.prisma.interest.findMany({
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
      }),
    ]);

    console.log(`Dashboard query took ${Date.now() - start}ms`);

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