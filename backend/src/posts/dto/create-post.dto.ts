import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  origin!: string;

  @IsString()
  destination!: string;

  @IsDateString()
  travelDate!: string;

  @IsString()
  travelTime!: string;

  @IsInt()
  @Min(1)
  availableSeats!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

