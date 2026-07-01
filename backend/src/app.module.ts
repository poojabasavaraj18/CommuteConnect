import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { InterestsModule } from './interests/interests.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, InterestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}




