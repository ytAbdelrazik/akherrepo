import { Controller, Post, Body, UseGuards, Delete } from '@nestjs/common';
import { RolesGuard } from '../user-managment/roles.guard';
import { Roles } from '../user-managment/roles.decorator';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('schedule')
  @UseGuards(RolesGuard)
  @Roles('admin') // Only admin can trigger backup
  async scheduleBackup(@Body('intervalDays') intervalDays: number): Promise<string> {
    if (!intervalDays || intervalDays <= 0) {
      throw new Error('Invalid interval days provided.');
    }
    return this.backupService.scheduleBackup(intervalDays);
  }

  @Delete('schedule')
  @UseGuards(RolesGuard)
  @Roles('admin') // Only admin can stop backup
  async stopBackupSchedule(): Promise<string> {
    return this.backupService.stopBackupSchedule();
  }
}
