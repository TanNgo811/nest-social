import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    // Configure TypeORM for PostgreSQL connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres', // Use 'postgres' as hostname for Docker container
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'social_media',
      entities: [User], // Register your User entity
      synchronize: true, // Auto-create database tables (for development, use migrations in production)
      logging: false, // Set to true to see SQL queries
    }),
    TypeOrmModule.forFeature([User]), // Register User entity with TypeORM
  ],
  controllers: [AuthController], // Register gRPC controller
  providers: [AuthService], // Register Auth service
})
export class AppModule {}
