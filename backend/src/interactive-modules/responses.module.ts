import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { Response, ResponseSchema } from './responses.schema';
import { Quiz, QuizSchema } from '../interactive-modules/quizzes.schema';
import { RolesGuard } from '../user-managment/roles.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    // Mongoose schemas for Responses and Quizzes
    MongooseModule.forFeature([
      { name: 'Response', schema: ResponseSchema },
      { name: 'Quiz', schema: QuizSchema },
    ]),
    // JWT module for authentication
    JwtModule.register({
      secret: 'ahmed', // Replace with a secure secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  controllers: [ResponsesController],
  providers: [ResponsesService, RolesGuard, Reflector],
  exports: [ResponsesService,MongooseModule], // Export the service for reuse in other modules
})
export class ResponsesModule {}
