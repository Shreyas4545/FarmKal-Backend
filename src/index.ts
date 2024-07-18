import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { Server } from 'http';
import { Express } from 'express';

const expressApp: Express = express();

async function createNestServer(expressInstance: Express): Promise<void> {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors(); // Enable CORS if needed
  await app.init();
}

const server: Server = new Server(expressApp);

export default async function handler(req, res) {
  if (!server.listening) {
    await createNestServer(expressApp);
    server.listen(parseInt(process.env.PORT) || 3000);
  }
  server.emit('request', req, res);
}
