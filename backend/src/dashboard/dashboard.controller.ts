import {
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/jwt/jwt.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  getDashboard(@Request() req) {
    return this.dashboardService.getDashboard(
      req.user.userId,
    );
  }
}