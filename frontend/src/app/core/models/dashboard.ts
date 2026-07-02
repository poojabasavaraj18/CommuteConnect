import { User } from './user';

export interface Dashboard {
  user: User;

  stats: {
    totalPosts: number;
    activePosts: number;
    interestsSent: number;
    interestsReceived: number;
  };

  recentPosts: any[];

  recentReceivedInterests: any[];
}