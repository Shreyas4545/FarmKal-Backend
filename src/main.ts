import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthInterceptor } from './Interceptors/authentication.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use the PORT environment variable provided by Vercel
  const port = process.env.PORT || 3000;
  const host = '0.0.0.0';

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(port, host);
  console.log(`Application is running on: http://${host}:${port}`);
}

bootstrap();
