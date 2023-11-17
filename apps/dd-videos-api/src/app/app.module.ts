import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ManageVideosModule } from './manage-videos/manage-videos.module';
import { RequestLoggerMiddleware } from '../middleware/request-logguer.middleware';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import {
  CORRELATION_ID_HEADER,
  CorrelationIdMiddleware,
} from '../middleware/correlation-id.middleware';
import { Request } from 'express';
import config from './config';

@Module({
  imports: [
    ManageVideosModule,
    LoggerModule.forRoot({
      pinoHttp: {
        timestamp: pino.stdTimeFunctions.isoTime,
        level: config.loggerLevel || 'info',
        transport: config.development
          ? {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            }
          : undefined,
        customProps: (req: Request) => {
          return {
            correlationId: req[CORRELATION_ID_HEADER],
          };
        },
        autoLogging: false,
        serializers: {
          req: () => {
            return undefined;
          },
          res: () => {
            return undefined;
          },
        },
      },
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
