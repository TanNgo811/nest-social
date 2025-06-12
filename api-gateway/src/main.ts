import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create a NestJS application with Fastify adapter
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable CORS for frontend development
  app.enableCors();

  // Setup Swagger (OpenAPI) documentation
  const config = new DocumentBuilder()
    .setTitle('Social Media API Gateway')
    .setDescription('RESTful API documentation for the Social Media Platform')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name is used to refer to the security scheme in operations
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be available at /api

  // Start the application on port 3000
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0', () => {
    console.log(`API Gateway is listening on port ${port} (HTTP/REST)`);
    console.log(`Swagger UI available at http://localhost:${port}/api`);
  });
}
bootstrap();