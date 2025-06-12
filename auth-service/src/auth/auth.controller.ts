import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from './interfaces/auth.interface'; // Import interfaces

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles user registration via gRPC.
   * Maps to the 'Register' method in the auth.proto service.
   * @param {RegisterRequest} data - The request data for user registration.
   * @returns {Promise<RegisterResponse>} - The response containing registration status.
   */
  @GrpcMethod('AuthService', 'Register')
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.register(data);
  }

  /**
   * Handles user login via gRPC.
   * Maps to the 'Login' method in the auth.proto service.
   * @param {LoginRequest} data - The request data for user login.
   * @returns {Promise<LoginResponse>} - The response containing an access token or error.
   */
  @GrpcMethod('AuthService', 'Login')
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(data);
  }

  /**
   * Handles token validation via gRPC.
   * Maps to the 'ValidateToken' method in the auth.proto service.
   * @param {ValidateTokenRequest} data - The request data containing the access token.
   * @returns {Promise<ValidateTokenResponse>} - The response indicating token validity and user ID.
   */
  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(
    data: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    return this.authService.validateToken(data);
  }
}
