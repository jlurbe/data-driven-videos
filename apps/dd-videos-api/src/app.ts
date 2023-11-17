import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger as PinoLogger } from 'nestjs-pino';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(PinoLogger));

  if (process.env.DEV_CORS) {
    app.enableCors();
  }

  await app.init();

  return app;
}
