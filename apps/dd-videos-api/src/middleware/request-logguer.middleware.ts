import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`[${req.method}] ${req.originalUrl} `);

    res.on('finish', () => {
      const statusCode = res.statusCode;

      if (statusCode === 401 || statusCode === 404 || statusCode === 405) {
        this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
      } else if (statusCode === 500) {
        this.logger.error(`[${req.method}] ${req.url} - ${statusCode}`);
      } else {
        this.logger.log(`[${req.method}] ${req.url} - ${statusCode}`);
      }
    });

    next();
  }
}
