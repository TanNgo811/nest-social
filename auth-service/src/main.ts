import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create a NestJS microservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // Configure gRPC transport
      transport: Transport.GRPC,
      options: {
        // Path to the .proto file which defines the gRPC service
        protoPath: join(__dirname, '../proto/auth.proto'),
        // Name of the gRPC package defined in the .proto file
        package: 'auth',
        // Address where the gRPC server will listen
        url: '0.0.0.0:5000',
        // Optional: Load all gRPC methods, even those not explicitly defined in the service
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        },
      },
    },
  );
  // Start the microservice
  await app.listen();
  console.log('Auth Microservice is listening on port 5000 (gRPC)');
}
bootstrap()