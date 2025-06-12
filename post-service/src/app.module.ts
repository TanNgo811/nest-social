import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';

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
      entities: [Post], // Register your Post entity
      synchronize: true, // Auto-create database tables (for development, use migrations in production)
      logging: false, // Set to true to see SQL queries
    }),
    TypeOrmModule.forFeature([Post]),
    PostModule, // Register Post entity with TypeORM
  ],
  controllers: [PostController], // Register gRPC controller
  providers: [PostService], // Register Post service
})
export class AppModule {}