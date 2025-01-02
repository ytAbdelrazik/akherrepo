import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesGuard } from './user-managment/roles.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';


import * as http from 'http';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow all origins (for testing)
  });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector, app.get(JwtService)));


  await app.listen(3000);
}
bootstrap();
