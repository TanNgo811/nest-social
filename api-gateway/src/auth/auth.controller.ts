import { Body, Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('Auth') // Categorize endpoints under 'Auth' in Swagger UI
@Controller('auth') // Base path for these endpoints
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   * @param {RegisterDto} registerDto - The data for user registration.
   * @returns {Promise<AuthResponseDto>} - Response indicating registration success.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Set HTTP status code to 201 Created
  @ApiOperation({ summary: 'Register a new user' }) // Swagger operation summary
  @ApiResponse({ status: 201, description: 'User successfully registered', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'User with email/username already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    const result = await this.authService.register(registerDto);
    if (!result.success) {
      // For more specific error handling, you could throw specific NestJS exceptions
      // e.g., throw new ConflictException(result.message);
      // For now, a generic 500 or 409 will suffice depending on the message
      throw new Error(result.message); // This will be caught by NestJS and return a 500 if not handled
    }
    return { success: result.success, message: result.message, accessToken: result.accessToken, userId: result.userId };
  }

  /**
   * Logs in an existing user.
   * @param {LoginDto} loginDto - The credentials for user login.
   * @returns {Promise<AuthResponseDto>} - Response containing access token on success.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK) // Set HTTP status code to 200 OK
  @ApiOperation({ summary: 'Login user and get JWT' })
  @ApiResponse({ status: 200, description: 'User successfully logged in', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    if (!result.success) {
      // For more specific error handling, throw UnauthorizedException
      // e.g., throw new UnauthorizedException(result.message);
      throw new Error(result.message);
    }
    return { success: result.success, message: result.message, accessToken: result.accessToken, userId: result.userId };
  }
}