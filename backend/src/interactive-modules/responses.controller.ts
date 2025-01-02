import { Controller, Post, Body, Get, Param, UseGuards, Req, NotFoundException, ConflictException } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { SubmitResponseDto } from './dtos/submit-response.dto';
import { RolesGuard } from '../user-managment/roles.guard';
import { Roles } from '../user-managment/roles.decorator';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post(':quizId/submit')
  @UseGuards(RolesGuard)
  @Roles('student') // Only students can submit answers
  async submitAnswers(
    @Param('quizId') quizId: string,
    @Body('answers') answers: { questionId: string; selectedOption: string }[],
    @Req() req,
  ) {
    const studentId = req.user.userId; // Fetch the student ID from the token
    return this.responsesService.submitResponse(studentId, quizId, answers);
  }
  
  
  
  
  

  @Get('feedback/:quizId')
  @UseGuards(RolesGuard)
  @Roles('student') // Only students can view feedback
  async getFeedback(@Req() req: any, @Param('quizId') quizId: string) {
    const studentId = req.user.userId; // Fetch the student ID from the JWT token
    return this.responsesService.getFeedback(studentId, quizId);
  }
}
