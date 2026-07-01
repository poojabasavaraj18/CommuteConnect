import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail({}, {
    message: 'Please enter a valid email',
  })
  email!: string;

  @IsString()
  @MinLength(6, {
    message: 'Password must contain at least 6 characters',
  })
  password! : string ;
}