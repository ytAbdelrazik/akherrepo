import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionBankController } from './question-bank.controller';
import { QuestionBankService } from './question-bank.service';
import { QuestionBankSchema } from './questionsbank.schema';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from '../user-managment/roles.guard';
import { Reflector } from '@nestjs/core';
import { UsersModule } from '../user-managment/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'QuestionBank', schema: QuestionBankSchema }]),
    JwtModule.register({
      secret: 'ahmed', // Replace with your JWT secret key
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UsersModule), // Import UsersModule for RolesGuard or user-related functionalities
  ],
  controllers: [QuestionBankController],
  providers: [
    QuestionBankService,
    RolesGuard, // Provide RolesGuard for role-based access control
    Reflector,  // Reflector is required by RolesGuard for metadata handling
  ],
  exports: [
    QuestionBankService, // Export QuestionBankService for other modules
    MongooseModule,       // Export MongooseModule for reuse of QuestionBank schema
  ],
})
export class QuestionBankModule {}
