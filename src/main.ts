import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use the PORT environment variable providped by Render
  const port = process.env.PORT || 3000;
  const host = '0.0.0.0';

  app.useGlobalPipes(new ValidationPipe());
  // app.enableCors();
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5501'],
  });
  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}

bootstrap();
