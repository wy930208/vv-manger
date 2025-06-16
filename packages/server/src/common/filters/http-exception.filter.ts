/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-14 14:58:50
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-14 14:59:29
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let code = 1;

    console.error('exception:', exception);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        message = (exceptionResponse as any)?.message || message;
      }

      // 根据HTTP状态码设置业务错误码
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          code = 400;
          break;
        case HttpStatus.UNAUTHORIZED:
          code = 401;
          break;
        case HttpStatus.FORBIDDEN:
          code = 403;
          break;
        case HttpStatus.NOT_FOUND:
          code = 404;
          break;
        default:
          code = status;
      }
    }

    const errorResponse = ApiResponse.error(message, code);

    response.status(status).json(errorResponse);
  }
}
