import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/jwt/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) {}

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

  @Get()
  findAll() {
    return this.postsService.findAll();
  }
}