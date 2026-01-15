import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

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
    // AuthModule.forRoot({
    //   jwtSecret: 'belem235@',
    //   tokenExpiresIn: '1h',
    // }),
    AuthModule.forRootAsync(),
    UsersModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ],
})
export class AppModule {}
