import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";
import { timestamp } from "rxjs";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    res.status(exception.getStatus()).json({
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    res.status(status).json({
      statusbar: status,
      message: errorResponse['message'] || null,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    })
  }
}