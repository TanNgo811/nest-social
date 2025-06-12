import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

// DTO for user registration requests
export class RegisterDto {
  @ApiProperty({ description: 'Unique username of the user', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @ApiProperty({ description: 'Unique email address of the user', example: 'john.doe@example.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password for the user account', example: 'StrongPassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

// DTO for user login requests
export class LoginDto {
  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password for the user account', example: 'StrongPassword123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

// DTO for authentication responses (login/register)
export class AuthResponseDto {
  @ApiProperty({ description: 'Indicates if the operation was successful', example: true })
  success: boolean;

  @ApiProperty({ description: 'A message describing the result of the operation', example: 'User registered successfully' })
  message: string;

  @ApiProperty({ description: 'The JWT access token (present on successful login)', example: 'eyJhbGciOiJIUzI1Ni...' })
  accessToken?: string;

  @ApiProperty({ description: 'The ID of the user (present on successful registration/login)', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  userId?: string;
}