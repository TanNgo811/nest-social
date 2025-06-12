import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private authService: AuthService) {}

  /**
   * Determines if the current request is authorized.
   * Extracts the JWT from the Authorization header and validates it using the Auth microservice.
   * @param {ExecutionContext} context - The current execution context.
   * @returns {Promise<boolean>} - True if authorized, false otherwise (throws UnauthorizedException).
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('AuthGuard: No Bearer token found in Authorization header');
      throw new UnauthorizedException('No authorization token provided');
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    if (!token) {
      this.logger.warn('AuthGuard: Token is empty after Bearer split');
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      // Call the Auth microservice to validate the token
      const { userId, isValid } = await this.authService.validateToken(token);

      if (isValid) {
        // If the token is valid, attach the user ID to the request object
        // This makes the userId available in subsequent controllers/services
        request.user = { userId };
        this.logger.log(`AuthGuard: Token valid for userId: ${userId}`);
        return true;
      } else {
        this.logger.warn('AuthGuard: Token validation failed');
        throw new UnauthorizedException('Invalid or expired token');
      }
    } catch (error) {
      this.logger.error(`AuthGuard: Token validation error: ${error.message}`, error.stack);
      // Catch any errors from gRPC call or JWT validation
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}