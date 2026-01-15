import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConstants } from './constants';
import type { AuthModuleOptions } from './auth-module.options';
// const expiresIn = process.env.JWT_EXPIRES_IN as JwtSignOptions['expiresIn'];
// const expiresIn = config.get<string>('JWT_EXPIRES_IN');

@Module({})
export class AuthModule {
  // static forRoot(options: AuthModuleOptions): DynamicModule {
  static forRootAsync(): DynamicModule {  
    return {
      module: AuthModule,
      imports: [
        ConfigModule,
        PassportModule,
        // with forRoot(options: AuthModuleOptions)
        // JwtModule.register({
        //   global: true,
        //   secret: options.jwtSecret,
        //   signOptions: {
        //     expiresIn: options.tokenExpiresIn
        //   },
        // }),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: config.getOrThrow<JwtSignOptions['expiresIn']>(
                'JWT_EXPIRES_IN',
              ),
            },    
          }),
        }),
        UsersModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy]
    }
  }
}
