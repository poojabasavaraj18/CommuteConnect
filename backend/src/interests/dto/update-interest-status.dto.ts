import { IsEnum } from 'class-validator';
import { InterestStatus } from '@prisma/client';

export class UpdateInterestStatusDto {

  @IsEnum(InterestStatus, {
    message: 'Status must be one of: PENDING, ACCEPTED, REJECTED',
  })
  status!: InterestStatus;

}