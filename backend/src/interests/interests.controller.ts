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
import { InterestsService } from './interests.service';
import { UpdateInterestStatusDto } from './dto/update-interest-status.dto';
// import { UpdateInterestStatusDto } from './dto/update-interest-status.dto';

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

  // Accept or reject an interest sent to one of your own rides.
  @Patch(':id/status')
  updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateInterestStatusDto,
  ) {
    return this.interestsService.updateStatus(
      id,
      req.user.userId,
      dto.status,
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