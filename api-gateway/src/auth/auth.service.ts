import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, AuthService as AuthServiceInterface } from './interfaces/auth.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private authServiceGrpc: AuthServiceInterface;

  // Inject the gRPC client configured in AppModule
  constructor(@Inject('AUTH_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    // Get the AuthService (gRPC service) from the gRPC client
    this.authServiceGrpc = this.client.getService<AuthServiceInterface>('AuthService');
  }

  /**
   * Calls the Auth microservice's Register gRPC method.
   * @param {RegisterRequest} data - User registration data.
   * @returns {Promise<RegisterResponse>} - Response from the Auth microservice.
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    // Use firstValueFrom to convert the Observable response to a Promise
    return firstValueFrom(this.authServiceGrpc.Register(data));
  }

  /**
   * Calls the Auth microservice's Login gRPC method.
   * @param {LoginRequest} data - User login credentials.
   * @returns {Promise<LoginResponse>} - Response from the Auth microservice.
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    return firstValueFrom(this.authServiceGrpc.Login(data));
  }

  /**
   * Calls the Auth microservice's ValidateToken gRPC method.
   * This is used by the authentication guard.
   * @param {string} accessToken - The JWT to validate.
   * @returns {Promise<{ userId: string; isValid: boolean }>} - Token validation result.
   */
  async validateToken(accessToken: string): Promise<{ userId: string; isValid: boolean }> {
    return firstValueFrom(this.authServiceGrpc.ValidateToken({ accessToken }));
  }
}