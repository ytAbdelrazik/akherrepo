import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user-managment/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../user-managment/users.module'; // Import UsersModule
import { FailedLogin, FailedLoginSchema } from './failed-login.schema';


@Module({
  imports: [
    UsersModule, // Ensure UsersModule is imported here
    MongooseModule.forFeature([{ name: 'FailedLogin', schema: FailedLoginSchema }]),
    JwtModule.register({
      secret: 'ahmed', // Replace with your secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
