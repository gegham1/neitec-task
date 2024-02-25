import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { logger } from 'src/common/helpers/logger';
import {
  BadRequestErrorCode,
  InternalServerErrorCode,
} from 'src/common/enum/error-code';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as {
      error: string;
      message: string;
    };

    if (exceptionResponse?.error && exceptionResponse?.message) {
      response.status(status).json({
        error_code:
          exceptionResponse.error === 'Bad Request'
            ? BadRequestErrorCode.API_VALIDATION
            : exceptionResponse.error,
        message: exceptionResponse.message,
      });
    } else {
      // Unknown error - publish to error alerting system
      logger.error(exception, 'Unhandled error caught');

      response.status(500).json({
        error_code: InternalServerErrorCode.INTERNAL_SERVER_ERROR,
        message:
          "Something went wrong, we're investigating the issue. Please retry in a moment",
      });
    }
  }
}
