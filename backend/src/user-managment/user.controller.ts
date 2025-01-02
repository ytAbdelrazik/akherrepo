import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  UseGuards, 
  Patch, 
  Param, 
  Query,

  Delete, Request,

  UnauthorizedException,
  Req,
  NotFoundException,

} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { CreateUserdto } from './dots/CreateUser.dto';
import { FailedLoginDocument } from './failed-login.schema';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Course } from 'src/course-management/course.schema';
import { Instructor } from 'src/course-management/instructor.schema';
import { Student } from 'src/course-management/student.schema';

import * as bcrypt from 'bcrypt';
import { UpdateInstructorDto } from './dots/UpdateInstructor.dto';
import { UpdateStudentDto } from './dots/UpdateStudent.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectModel('FailedLogin') private readonly failedLoginModel: Model<FailedLoginDocument>,
    @InjectModel('Course') private readonly courseModel: Model<Course>, // Inject the Course model
  ) {}



  @Get('getUser/byId')
  async getUserById(@Query('userId') userId: string) {
      const user = await this.userService.getUserById(userId);
      return user;

  }
  

  @Post()
  async createUser(@Body() createUserDto: CreateUserdto): Promise<any> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      console.error('Error in createUser:', error.message);
      throw error;
    }

  }
  




  @Patch('profile/update')
  @UseGuards(RolesGuard) // Ensure the user is authenticated
  async updateProfile(@Req() req, @Body() updateData: UpdateStudentDto | UpdateInstructorDto) {
    const userId = req.user.userId; // Extract userId from the logged-in user's JWT
    const role = req.user.role; // Extract role from the logged-in user's JWT
  
    // Only allow instructors and students to update their profiles
    if (role !== 'student' && role !== 'instructor') {
      throw new UnauthorizedException('Only students and instructors can update their profiles');
    }
  
    // Prepare the update payload
    const updatePayload: Partial<UpdateStudentDto | UpdateInstructorDto> = { ...updateData };
  
    // If the password field is included, hash the password and add `passwordHash`
    if (updateData.password) {
      updatePayload.password = await bcrypt.hash(updateData.password, 10); // Hash the password
      delete updatePayload.password; // Remove the plain password
    }
  
    return this.userService.updateUser(userId, role, updatePayload);
  }
  
  

  @Get('students')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllStudents() {
    return this.userService.getAllByRole('student');
  }

  @Get('instructors')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllInstructors() {
    return this.userService.getAllByRole('instructor');
  }


  @Get(':userId/enrolled-courses')
  async getEnrolledCourses(@Param('userId') userId: string) {
    const user = await this.userService.getUserById(userId);
    
    // Check if the user is a Student and return enrolledCourses
    if (user instanceof Student) {
      return user.enrolledCourses; // Ensure this is an array of Course objects
    }

    throw new Error('User is not a student');
  }


  @Get(':userId/created-courses')
  async getCreatedCourses(@Param('userId') userId: string) {
    const user = await this.userService.getUserById(userId);
    
    // Check if the user is an Instructor and return createdCourses
    if (user instanceof Instructor) {
      return user.createdCourses; // Ensure this is an array of Course objects
    }

    throw new Error('User is not an instructor');
  }


  @Get('search')
  @UseGuards(RolesGuard)
  @Roles('instructor','admin') // Restrict to instructors
  async searchStudents(
    @Query('name') name: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    if (!name) {
      throw new NotFoundException('Name parameter is required for search');
    }
    const students = await this.userService.searchStudentsByName(name, limit, offset);
    if (!students || students.length === 0) {
      throw new NotFoundException(`No students found for name: "${name}"`);
    }
    return students;
  }




  
  @Get('failed-logins') 
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getFailedLogins(): Promise<any> {
    return this.failedLoginModel.find().sort({ timestamp: -1 }).exec();
  }
  
  @Patch('courses/:courseId/availability')
  @UseGuards(RolesGuard)
  @Roles('admin') // Ensure only admins can access this
  async updateCourseAvailability(
    @Param('courseId') courseId: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.userService.updateCourseAvailability(courseId, isAvailable);
  }

  @Delete('users/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin') // admin deleting other users
  async deleteUserByAdmin(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }

  
  @Delete('users/self')
  @UseGuards(RolesGuard)
  @Roles('student','instructor', 'admin') // Users with these roles can delete themselves
  async deleteSelf(@Request() req: any) {
    const userId = req.user.userId; // Get the userId from the request object
    return this.userService.deleteUser(userId);
  }
  

  @Patch(':userId/add-courses/student')
  async addCoursesToStudent(
    @Param('userId') userId: string,
    @Body('courseIds') courseIds: string[],
  ) {
    return this.userService.addCoursesToStudent(userId, courseIds);
  }


   

}
