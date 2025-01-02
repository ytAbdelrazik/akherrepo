import { Body, Controller, Post, UseGuards, Get, Param, Patch, NotFoundException, Delete, BadRequestException } from '@nestjs/common';
import { QuestionBankService } from './question-bank.service';
import { Roles } from '../user-managment/roles.decorator';
import { RolesGuard } from '../user-managment/roles.guard';
import { CreateQuestionDto } from './dtos/CreateQuestion.dto';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  // Endpoint to add questions to a module's question bank
  @Post('add')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Only instructors can add questions
  async addQuestionBank(@Body() createQuestionBankDto: CreateQuestionDto) {
    return this.questionBankService.addQuestion(createQuestionBankDto);
  }

  // Endpoint to view question bank for a module
  @Get(':moduleId')
  @UseGuards(RolesGuard)
  @Roles('instructor', 'student') // Allow both instructors and students to view the question bank
  async getQuestionBank(@Param('moduleId') moduleId: string) {
    return this.questionBankService.getQuestionBankByModule(moduleId);
  }

//http://localhost:3000/question-bank/M102/edit-question/1
  @Patch(':moduleId/edit-question/:questionIndex')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Only instructors can access this endpoint
  async editQuestion(
    @Param('moduleId') moduleId: string,
    @Param('questionIndex') questionIndex: number,
    @Body() updatedQuestion: any, // Accepts updated question data
  ) {
    if (!updatedQuestion) {
      throw new NotFoundException('No question data provided for update');
    }

    return this.questionBankService.editQuestion(moduleId, questionIndex, updatedQuestion);
  }
//http://localhost:3000/question-bank/M102/delete-question/1
  @Delete(':moduleId/delete-question/:questionIndex')
  @UseGuards(RolesGuard)
  @Roles('instructor') // Only instructors can access this endpoint
  async deleteQuestion(
    @Param('moduleId') moduleId: string,
    @Param('questionIndex') questionIndex: number,
  ) {
    return this.questionBankService.deleteQuestion(moduleId, questionIndex);
  }

  @Patch(':moduleId/add-questions')
  @Roles('instructor') // Only instructors can add questions
  async addQuestionsToBank(
    @Param('moduleId') moduleId: string,
    @Body('questions') questions: any[],
  ) {
    if (!questions || questions.length === 0) {
      throw new BadRequestException('No questions provided to add.');
    }
    return this.questionBankService.addQuestionsToBank(moduleId, questions);
  }
}
