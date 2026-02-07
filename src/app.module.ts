import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ResponseLoggingInterceptor } from './common/interceptors/response-logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRES_IN: Joi.string().required(),
  }),
    }),
    PostsModule,
    UsersModule,
    // AuthModule.forRoot({
    //   jwtSecret: 'belem235@',
    //   tokenExpiresIn: '1h',
    // }),
    AuthModule.forRootAsync(),
    ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard
    },
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseLoggingInterceptor
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
    .forRoutes('*')
  }
}
