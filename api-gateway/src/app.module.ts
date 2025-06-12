import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';
import { PostController } from './post/post.controller';
import { AuthService } from './auth/auth.service';
import { PostService } from './post/post.service';

@Module({
  imports: [
    // Configure gRPC client for Auth Service
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE', // Token to inject the client
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_SERVICE_URL || 'auth-service:5000', // Connect to auth-service container
          protoPath: join(__dirname, '../proto/auth.proto'),
          package: 'auth',
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
        },
      },
      {
        name: 'POST_SERVICE', // Token to inject the client
        transport: Transport.GRPC,
        options: {
          url: process.env.POST_SERVICE_URL || 'post-service:5001', // Connect to post-service container
          protoPath: join(__dirname, '../proto/post.proto'),
          package: 'post',
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, PostController], // Register REST controllers
  providers: [AuthService, PostService], // Register services that use gRPC clients
})
export class AppModule {}