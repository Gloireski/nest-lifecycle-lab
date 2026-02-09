import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpErrorFilter, HttpExceptionFilter } from './common/filters/exeptions.filter';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

  async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable versioning 
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1'
  });
  // use our geeneric validator globaly
  const config = new DocumentBuilder()
    .setTitle('Posts example')
    .setDescription('The posts API description')
    .setVersion('1.0')
    .addTag('posts')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpErrorFilter());
    // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
