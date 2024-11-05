import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import logger from './logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const data = exception.getResponse() as { message: string | string[] };

    const logMessage = `${new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    })} - METHOD: [${request.method}] - PATH: [${request.url}] - STATUS: [${status}] - MESSAGE: [${exception instanceof Error ? exception.message : 'Unknown error'}]`;
    logger.error(logMessage);

    response.status(status).json({
      status: 0,
      message: typeof data.message == 'string' ? data.message : data.message[0],
    });
  }
}
