import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { runMigrations } from './database/run-migrations';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Run database migrations on startup
  try {
    const dataSource = app.get<DataSource>(getDataSourceToken());
    await runMigrations(dataSource);
  } catch (error) {
    console.error('Failed to run migrations:', error);
    // Continue anyway - migrations might already be applied
  }

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // API prefix
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Food Store Calculator API')
    .setDescription('API documentation for products, orders, and red status endpoints')
    .setVersion('1.0')
    .addTag('Products')
    .addTag('Orders')
    .addTag('Red Status')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      displayRequestDuration: true,
      docExpansion: 'none',
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend API is running on: http://localhost:${port}/api`);
  console.log(`📘 Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
