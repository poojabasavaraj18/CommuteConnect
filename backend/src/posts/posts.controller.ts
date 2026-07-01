import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/jwt/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { Query } from '@nestjs/common';
import { GetPostsQueryDto } from './dto/get-posts-query.dto/get-posts-query.dto';
import { UpdatePostStatusDto } from './dto/update-post-status.dto/update-post-status.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) {}

  // Create a new commute post
  @UseGuards(JwtGuard)
  @Post()
  create(
    @Request() req,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(
      req.user.userId,
      dto,
    );
  }

  // Get all commute posts
  @Get()
  findAll(@Query() query: GetPostsQueryDto) {
  return this.postsService.findAll(query);
  }

  // Get logged-in user's posts
  @UseGuards(JwtGuard)
  @Get('my')
  findMyPosts(@Request() req) {
    return this.postsService.findMyPosts(
      req.user.userId,
    );
  }

  // Update a commute post
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(
      req.user.userId,
      id,
      dto,
    );
  }

@UseGuards(JwtGuard)
@Patch(':id/status')
updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdatePostStatusDto,
  @Request() req,
) {
  return this.postsService.updateStatus(
    id,
    req.user.userId,
    dto,
  );
}  
  // Delete a commute post
  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.postsService.delete(
      req.user.userId,
      id,
    );
  }
}