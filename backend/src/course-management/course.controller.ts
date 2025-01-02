
import { UseGuards, Req, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';

import { Controller, Post, Get, Delete, Body, Param, Query, Patch } from '@nestjs/common';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dots/create-course.dto';
import { UpdateCourseDto } from './dots/update-course.dto';
import { AddMultimediaDto } from './dots/add-multimedia.dto';
import { UserService } from 'src/user-managment/user.service';
import { NotFoundException } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from 'src/user-managment/roles.guard';
import { Roles } from 'src/user-managment/roles.decorator';
import { Course } from './course.schema';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService,
  private readonly UserService : UserService

  ) {}
  @Post()
  async createCourse(
    @Body('insID') insID: string, // Extract instructor ID from the body
    @Body() createCourseDto: CreateCourseDto, // Extract the rest of the body as CreateCourseDto
  ) {
    if (!insID) {
      throw new NotFoundException('Instructor ID is required');
    }

  
    // Check if the instructor ID is valid
    const isadmin = await  this.UserService.getUserById(insID);
 
    if (!(isadmin.role==='instructor')) {
      throw new NotFoundException('Invalid instructor ID'); // Throw error if the ID is invalid
    }
    const isCourseExist =await this.courseService.courseExists(createCourseDto.courseId);
    if (isCourseExist) {
      throw new NotFoundException('Course ID already exists'); // Prevent creating duplicate course IDs
    }


    const course=this.courseService.createCourse(createCourseDto, insID); 
    await this.updateInstructorCourses((await course).courseId,insID);
    return;
  }

  
  
    
    


 
  

  

  @Get()
  async getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Post(':courseId')
  async updateCourse(@Param('courseId') courseId: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.updateCourse(courseId, updateCourseDto);
  }

  @Post(':courseId/revert')
  async revertToVersion(@Param('courseId') courseId: string, @Query('version') version: string) {
    return this.courseService.revertToVersion(courseId, version);
  }

  @Get(':courseId/versions')
  async getVersions(@Param('courseId') courseId: string) {
    return this.courseService.getVersions(courseId);
  }

  @Post(':courseId/multimedia')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Restrict to instructors only
  async addMultimedia(
    @Param('courseId') courseId: string, 
    @Body() multimediaDto: AddMultimediaDto
  ) {
    return this.courseService.addMultimedia(courseId, multimediaDto);
  }
  
  @Delete(':courseId/multimedia/:multimediaId')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Restrict to instructors only
  async removeMultimedia(
    @Param('courseId') courseId: string, 
    @Param('multimediaId') multimediaId: string
  ) {
    return this.courseService.removeMultimedia(courseId, multimediaId);
  }

  @Get(':courseId/multimedia')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Restrict to instructors only
  async getMultimedia(@Param('courseId') courseId: string) {
    return this.courseService.getMultimedia(courseId);
  }

 
  /**
   * Search courses by title, category, or createdBy  http://localhost:3000/courses/search?query=AI
   */
  @Get('search/courses')
  async searchCourses(
    @Query('query') query: string,
    @Query('limit') limit = 10,
    @Query('skip') skip = 0,
  ): Promise<Course[]> {
    if (!query) {
      throw new NotFoundException('Query parameter is required for search');
    }
    return this.courseService.searchCourses(query, limit, skip);
  }

  
  /**
   * Get all enrolled courses for the logged-in student.
   * @param req - The request object containing JWT user details.
   * @returns List of enrolled courses for the student.
   */
  @Get('students/enrolled-courses')
  @UseGuards(RolesGuard) // Ensure authentication and role validation
  async getAllEnrolledCourses(@Req() req) {
    console.log('Authenticated User:', req.user); // Log the authenticated user
    const userId = req.user.userId;
    const role = req.user.role;
  
    if (role !== 'student') {
      throw new UnauthorizedException('Only students can view enrolled courses');
    }
  
    return this.courseService.getAllEnrolledCourses(userId);
  }
  
  

  @Patch(':courseId/instructor/:instructorId')
  async updateInstructorCourses(
    @Param('courseId') courseId: string,
    @Param('instructorId') instructorId: string,
  ): Promise<void> {
    try {
      
      await this.courseService.updateINS(courseId, instructorId);
    } catch (error) {
      throw new Error(`Error updating instructor's courses: ${error.message}`);
    }
  }

 
  
  @Get('instructors/search')
  @UseGuards(RolesGuard)
  @Roles('student') // Only students can access this endpoint
  async searchInstructors(
    @Query('query') query: string, // Updated to 'query'
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    if (!query) {
      throw new NotFoundException('Query parameter is required for search');
    }
    const instructors = await this.courseService.searchInstructors(query, limit, offset);
    if (!instructors || instructors.length === 0) {
      throw new NotFoundException(`No instructors found for query: "${query}"`);
    }
    return instructors;
  }


  
  @Get('students/:studentId/enrolled-courses')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Only instructors can access this endpoint
  async getStudentEnrolledCourses(
    @Param('studentId') studentId: string,
  ) {
    return this.courseService.getStudentEnrolledCourses(studentId);
  }

  @Get('order')
  async getCoursesOrderedByDate(
    @Query('order') order: 'asc' | 'desc' = 'asc', // Default to ascending order
  ): Promise<Course[]> {
    if (!['asc', 'desc'].includes(order)) {
      throw new BadRequestException('Invalid order parameter. Use "asc" or "desc".');
    }
    return this.courseService.getCoursesOrderedByDate(order);
  }
  
  @Get('students/completed')
  @Roles('student') // Only students can access this endpoint
  async getCompletedCourses(@Req() req) {
    const studentId = req.user.userId; // Fetch student ID from the logged-in user's JWT
    return this.courseService.getCompletedCourses(studentId);
  }

  @Get(':courseId/completed-students')
  @Roles('instructor') // Only instructors can access this endpoint
  async getStudentsWhoCompletedCourse(@Req() req, @Param('courseId') courseId: string) {
    const instructorId = req.user.userId; // Extract instructor ID from logged-in user's token
    return this.courseService.getStudentsWhoCompletedCourse(instructorId, courseId);
  }

  @Post(':courseId/keywords')
@UseGuards(RolesGuard)
@Roles('instructor') // Only instructors can access
async addKeywordsToCourse(
  @Param('courseId') courseId: string,
  @Body('keywords') keywords: string[],
  @Req() req,
) {
  const instructorId = req.user.userId; // Fetch instructor ID from token
  return this.courseService.addKeywordsToCourse(courseId, keywords, instructorId);
}
@Get(':courseId')
async getCourseById(@Param('courseId') courseId: string) {
  try {
    const course = await this.courseService.getCourseById(courseId); // Call the service method

    // Return the course if found
    return course;
  } catch (error) {
   throw(error)
  }
}
@Get(':courseId/details')
async getCourseDetails(@Param('courseId') courseId: string): Promise<Course> {
  const course = await this.courseService.getCourseById(courseId);
  if (!course) {
    throw new NotFoundException(`Course with ID ${courseId} not found`);
  }
  return course;
}


  
  
}
