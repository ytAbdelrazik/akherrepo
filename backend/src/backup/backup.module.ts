import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { RolesGuard } from '../user-managment/roles.guard';
import { Reflector } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    JwtModule.register({
      secret: 'ahmed', // Replace with your secret key
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([]), // Add necessary schemas if required
  ],
  controllers: [BackupController],
  providers: [
    BackupService,
    RolesGuard, // Ensure RolesGuard is provided
    Reflector,  // Required for RolesGuard
  ],
})
export class BackupModule {}
