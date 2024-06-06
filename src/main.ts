import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Use the ConfigService to get the port
  const port = process.env.PORT || 10000;

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(10000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
