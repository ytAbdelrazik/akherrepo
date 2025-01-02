import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  Query,
  UseGuards,
  BadRequestException,
  Logger,
  HttpStatus
} from '@nestjs/common';
import { PerformanceTrackingService } from './performance-tracking.service';
import { UpdateProgressDto } from './dtos/update-progress.dto';
import { Response } from 'express';
import { Roles } from 'src/user-managment/roles.decorator';
import { RolesGuard } from 'src/user-managment/roles.guard';

@Controller('performance-tracking')
@UseGuards(RolesGuard)
export class PerformanceTrackingController {
  constructor(private readonly service: PerformanceTrackingService) {}

  // Endpoint to create a new progress record
  @Post()
  async createProgress(@Body() body: UpdateProgressDto) {
    return this.service.createProgress(body);
  }
  @Get('module-ratings/:courseId')
  async getModuleRatings(@Param('courseId') courseId: string) {
    return this.service.getModuleRatings(courseId);
  }
  // Endpoint to get all progress records
  @Get('/allprog')
  async getAllProgress() {
    return this.service.getAllProgress();
  }
  @Get('quiz-performance/:quizId')
  async getQuizPerformanceByQuizId(@Param('quizId') quizId: string) {
    return this.service.getQuizPerformanceByQuizId(quizId);
  }
  @Get('quiz-performance/student/:quizId/:userId')
  async getStudentQuizPerformance(
    @Param('quizId') quizId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.getStudentQuizPerformance(quizId, userId);
  }
  // Endpoint to add a rating (for course or module)
  @Post('rating')
  async addRating(
    @Body()
    {
      userId,
      courseId,
      moduleId,
      rating,
    }: { userId: string; courseId: string; moduleId?: string; rating: number },
  ) {
    return this.service.addRating(userId, courseId, moduleId || null, rating);
  }
  @Post('instructor')
  async addInstructorRating(
    @Body('userId') userId: string,
    @Body('instructorId') instructorId: string,
    @Body('courseId') courseId: string, // Optional
    @Body('rating') rating: number,
  ) {
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5.');
    }

    return this.service.addInstructorRating(userId, instructorId, courseId, rating);
  }
  // Endpoint to get the average rating for a course
  @Get('courserating/:courseId')
  async getAverageRatingForCourse(@Param('courseId') courseId: string) {
    return this.service.getAverageRatingForCourse(courseId);
  }
   
  // Endpoint to get the average rating for an instructor
  @Get('instructor/:instructorId')
  async getAverageRatingForInstructor(@Param('instructorId') instructorId: string) {
    return this.service.getAverageRatingForInstructor(instructorId);
  }

  // Endpoint to get the progress of a specific user
  @Get('/user/:userId')
  async getProgressByUser(@Param('userId') userId: string) {
    return this.service.getProgressByUser(userId);
  }
/*
  // Endpoint to calculate the progress for a specific user in a course
  @Get('/user/:userId/course/:courseId/progress')
  async calculateProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.service.calculateProgress(userId, courseId);
  }
*/
  // Endpoint to update progress for a specific user
  @Put('/:progressId')
  async updateProgress(
    @Param('progressId') progressId: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.service.updateProgress(progressId, updateProgressDto);
  }
  

  // Endpoint to delete a progress record
  @Delete('/:progressId')
  async deleteProgress(@Param('progressId') progressId: string) {
    return this.service.deleteProgress(progressId);
  }
 
  // Endpoint to get the student dashboard by student ID
  @Get('/dashboard/:studentId')
  async getStudentDashboard(@Param('studentId') studentId: string) {
    return this.service.getStudentDashboard(studentId);
  }


  // Endpoint to get analytics for a specific course
  @Get('/analytics/course/:courseId')
  async getCourseAnalytics(@Param('courseId') courseId: string) {
    return this.service.getCourseAnalytics(courseId);
  }
@Get(':userId/:courseId/export')
  
  @Roles('instructor')
async exportData(
  @Param('courseId') courseId: string,
  @Param('userId') userId: string, 
  @Query('format') format: string = 'csv',
  @Res() res: Response
) {
  console.log(`Export request received for courseId: ${courseId}, userId: ${userId} with format: ${format}`);

  try {
    const analyticsData = await this.service.exportAnalytics(courseId, userId, format, res);  // This should handle the response
    res.status(HttpStatus.OK).json(analyticsData);  // Send the data back as a JSON response
  } catch (error) {
    console.error('Error exporting analytics:', error.message);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while exporting data.' });
  }
}

}
