import { Controller, Post, Body, Param, UseGuards, Get, Patch, BadRequestException, Delete, Req, NotFoundException } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { RolesGuard } from '../user-managment/roles.guard';
import { Roles } from '../user-managment/roles.decorator';

@Controller('quizzes')
@UseGuards(RolesGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  /**
   * Generate a randomized quiz.
   */
  @Post('create/:moduleId')
  @UseGuards(RolesGuard)
  @Roles('instructor')
  async createQuiz(
    @Param('moduleId') moduleId: string,
    @Body('numberOfQuestions') numberOfQuestions: number,
    @Body('questionType') questionType: string,
    @Body('difficulty') difficulty: string,
    @Body('courseId') courseId: string,

  ) {
    return this.quizzesService.createQuiz(moduleId, courseId, numberOfQuestions, questionType, difficulty);
  }
  
  

  @Post(':quizId/start')
  @UseGuards(RolesGuard)
  @Roles('student')
  async startQuiz(@Param('quizId') quizId: string, @Req() req) {
    const studentId = req.user.userId;
    return this.quizzesService.generateQuizForStudent(quizId, studentId);
  }

  @Get('student/quizzes')
@UseGuards(RolesGuard)
@Roles('student') // Restrict access to students
async getQuizzesForStudentCourses(@Req() req) {
  const userId = req.user.userId; // Extract userId from JWT
  return this.quizzesService.getQuizzesForStudentCourses(userId);
}

  
  


  /**
   * Get a quiz by module ID.
   */
  @Get(':moduleId')
  @Roles('student')
  async getQuizByModule(@Param('moduleId') moduleId: string) {
    return this.quizzesService.getQuizByModule(moduleId);
  }

  /**
   * Update a quiz.
   */
  @Patch(':quizId')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Only instructors can update quizzes
  async updateQuiz(@Param('quizId') quizId: string, @Body() updatedData: Partial<CreateQuizDto>) {
    return this.quizzesService.updateQuiz(quizId, updatedData);
  }

  @Delete(':quizId')
  @Roles('instructor') // Only instructors can delete quizzes
  async deleteQuiz(@Param('quizId') quizId: string) {
    return this.quizzesService.deleteQuiz(quizId);
  }

  @Get('course/:courseId')
async getQuizzesForCourse(@Param('courseId') courseId: string) {
  return this.quizzesService.getQuizzesForCourse(courseId);
}



}



