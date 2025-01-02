import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, UnauthorizedException, Query } from '@nestjs/common';
import { ModuleService } from './module.service';
import { RolesGuard } from '../user-managment/roles.guard';
import { Roles } from '../user-managment/roles.decorator';
import { CreateModuleDto } from 'src/course-management/dots/create-module.dto';
import { UpdateModuleDto } from './dots/update-module.dto';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  /**
   * Create a new module for a course.
   * Only accessible by instructors.
   * @param req - The request object containing the logged-in instructor's userId.
   * @param moduleDto - Module data transfer object.
   */
  @Post('create')
  @UseGuards(RolesGuard)
  @Roles('instructor')
  async createModule(@Req() req, @Body() moduleDto: CreateModuleDto) {
    const userId = req.user.userId; // Extract userId from JWT
    return this.moduleService.createModule(userId, moduleDto);
  }

  /**
   * Get all modules for a specific course.
   * Accessible by anyone.
   * @param courseId - ID of the course.
   */
  @Get(':courseId/modules')
  @UseGuards(RolesGuard)
  @Roles('student') // Only students can access
  async getModulesForStudents(@Param('courseId') courseId: string) {
    return this.moduleService.getModulesForStudents(courseId);
  }
  





  @Get('ordered-by-date')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Only instructors can access
  async getModulesOrderedByDate(@Query('order') order: 'asc' | 'desc' = 'desc', @Req() req: any) {
    if (req.user.role !== 'instructor') {
      throw new UnauthorizedException('Only instructors can order modules');
    }
    return this.moduleService.getModulesOrderedByDate(order);
  }


  @Patch(':moduleId')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Only instructors can update modules
  async updateModule(
    @Req() req,
    @Param('moduleId') moduleId: string,
    @Body() updateData: any,
  ) {
    const userId = req.user.userId; // Fetch instructor ID from token
    return this.moduleService.updateModule(userId, moduleId, updateData);
  }
  

}
