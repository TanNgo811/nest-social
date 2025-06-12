import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/user.entity';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from './interfaces/auth.interface'; // Import interfaces

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly JWT_SECRET =
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_please_change_me'; // Load from environment variable

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Registers a new user.
   * Hashes the password before saving to the database.
   * @param {RegisterRequest} data - User registration data.
   * @returns {Promise<RegisterResponse>} - Response indicating success or failure.
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    this.logger.log(`Attempting to register user: ${data.email}`);
    try {
      // Check if user already exists
      const existingUser = await this.usersRepository.findOne({
        where: [{ email: data.email }, { username: data.username }],
      });
      if (existingUser) {
        this.logger.warn(
          `Registration failed: User with email or username already exists: ${data.email}`,
        );
        return {
          message: 'User with this email or username already exists',
          success: false,
          userId: null,
        };
      }

      // Hash the password
      if (!data.password) {
        this.logger.warn(`Registration failed: Password is required`);
        return {
          message: 'Password is required',
          success: false,
          userId: null,
        };
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create new user entity
      const newUser = this.usersRepository.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
      });

      // Save user to database
      const savedUser = await this.usersRepository.save(newUser);
      this.logger.log(
        `User registered successfully: ${JSON.stringify(savedUser)}`,
      );
      return {
        message: 'User registered successfully',
        success: true,
        userId: savedUser[0].id,
      };
    } catch (error) {
      this.logger.error(
        `Error during registration for ${data.email}: ${error.message}`,
        error.stack,
      );
      return { message: 'Registration failed', success: false, userId: null };
    }
  }

  /**
   * Logs in a user.
   * Compares provided password with hashed password and generates a JWT.
   * @param {LoginRequest} data - User login credentials.
   * @returns {Promise<LoginResponse>} - Response containing access token or error message.
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    this.logger.log(`Attempting to log in user: ${data.email}`);
    try {
      // Find user by email
      const user = await this.usersRepository.findOne({
        where: { email: data.email },
      });
      if (!user) {
        this.logger.warn(
          `Login failed: User not found for email: ${data.email}`,
        );
        return {
          accessToken: null,
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Compare passwords
      if (!data.password) {
        this.logger.warn(`Login failed: Password is required`);
        return {
          accessToken: null,
          success: false,
          message: 'Password is required',
        };
      }
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        this.logger.warn(
          `Login failed: Invalid password for email: ${data.email}`,
        );
        return {
          accessToken: null,
          success: false,
          message: 'Invalid credentials',
        };
      }

      // Generate JWT
      const payload = { userId: user.id, username: user.username };
      const accessToken = jwt.sign(payload, this.JWT_SECRET, {
        expiresIn: '1h',
      }); // Token expires in 1 hour
      this.logger.log(`User logged in successfully: ${user.id}`);
      return {
        accessToken: accessToken,
        success: true,
        message: 'Login successful',
      };
    } catch (error) {
      this.logger.error(
        `Error during login for ${data.email}: ${error.message}`,
        error.stack,
      );
      return { accessToken: null, success: false, message: 'Login failed' };
    }
  }

  /**
   * Validates a JWT.
   * @param {ValidateTokenRequest} data - Request containing the access token.
   * @returns {Promise<ValidateTokenResponse>} - Response indicating token validity and user ID.
   */
  async validateToken(
    data: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    this.logger.log(`Attempting to validate token`);
    try {
      // Verify the token
      const decoded = jwt.verify(data.accessToken, this.JWT_SECRET) as {
        userId: string;
        username: string;
      };
      this.logger.log(
        `Token validated successfully for userId: ${decoded.userId}`,
      );
      return { userId: decoded.userId, isValid: true };
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      return { userId: null, isValid: false };
    }
  }
}
