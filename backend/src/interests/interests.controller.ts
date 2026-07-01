import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/jwt/jwt.guard';
import { InterestsService } from './interests.service';

@Controller('interests')
@UseGuards(JwtGuard)
export class InterestsController {
  constructor(
    private readonly interestsService: InterestsService,
  ) {}

  @Post(':postId')
  expressInterest(
    @Request() req,
    @Param('postId') postId: string,
  ) {
    return this.interestsService.expressInterest(
      req.user.userId,
      postId,
    );
  }

  @Get('my')
  myInterests(@Request() req) {
    return this.interestsService.myInterests(
      req.user.userId,
    );
  }

  @Get('received')
  receivedInterests(@Request() req) {
    return this.interestsService.receivedInterests(
      req.user.userId,
    );
  }

  @Delete(':postId')
  removeInterest(
    @Request() req,
    @Param('postId') postId: string,
  ) {
    return this.interestsService.removeInterest(
      req.user.userId,
      postId,
    );
  }
}