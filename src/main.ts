import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from 'src/config';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const LOGGER = new Logger('Main - API Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '',
        method: RequestMethod.GET,
      },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173', // Origen permitido
    methods: 'GET,POST, PUT, PATCH,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeceras permitidas
    credentials: true, // Permite el envío de cookies o credenciales
  });

  await app.listen(envs.port);

  LOGGER.log(`API Gateway running on port ${envs.port}`);
}
bootstrap();
