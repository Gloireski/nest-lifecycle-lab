import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const start = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`Execution: ${Date.now() - start}ms`)),
    );
  }
}
