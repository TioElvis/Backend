import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Infinity-API')
    .setDescription('ApiREST for infinity')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('posts')
    .addTag('users')
    .addTag('friends')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('infinity-api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(9000, '0.0.0.0');
}

bootstrap();
