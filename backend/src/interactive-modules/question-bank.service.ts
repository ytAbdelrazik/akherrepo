import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestionBank, QuestionBankDocument } from './questionsbank.schema';
import { CreateQuestionDto } from './dtos/CreateQuestion.dto';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBankDocument>,
  ) {}

  // Add or update question bank for a module
  async addQuestion(createQuestionBankDto: CreateQuestionDto): Promise<QuestionBank> {
    // Validate if a similar question bank already exists for the module
    const existingQuestionBank = await this.questionBankModel.findOne({
      moduleId: createQuestionBankDto.moduleId,
    }).exec();

    if (existingQuestionBank) {
      throw new ConflictException('A question bank for this module already exists');
    }

    // Create a new question bank
    const newQuestionBank = new this.questionBankModel(createQuestionBankDto);
    return await newQuestionBank.save();
  }

  

  // Retrieve question bank by module ID
  async getQuestionBankByModule(moduleId: string): Promise<QuestionBank> {
    const questionBank = await this.questionBankModel.findOne({ moduleId }).exec();
    if (!questionBank) {
      throw new NotFoundException(`No question bank found for module ID '${moduleId}'`);
    }
    return questionBank;
  }

  async editQuestion(
    moduleId: string,
    questionIndex: number,
    updatedQuestion: {
      question?: string;
      options?: string[];
      answer?: string;
      type?: 'MCQ' | 'TF';
      difficulty?: 'easy' | 'medium' | 'hard';
    },
  ): Promise<any> {
    const questionBank = await this.questionBankModel.findOne({ moduleId }).exec();

    if (!questionBank) {
      throw new NotFoundException(`Question bank for module ID '${moduleId}' not found`);
    }

    if (questionIndex < 0 || questionIndex >= questionBank.questions.length) {
      throw new NotFoundException(`Invalid question index '${questionIndex}'`);
    }

    // Update the specified question
    const question = questionBank.questions[questionIndex];

    if (updatedQuestion.question) question.question = updatedQuestion.question;
    if (updatedQuestion.options) question.options = updatedQuestion.options;
    if (updatedQuestion.answer) question.answer = updatedQuestion.answer;
    if (updatedQuestion.type) question.type = updatedQuestion.type;
    if (updatedQuestion.difficulty) question.difficulty = updatedQuestion.difficulty;

    await questionBank.save();

    return { message: 'Question updated successfully', updatedQuestion: question };
  }

  async deleteQuestion(moduleId: string, questionIndex: number): Promise<any> {
    const questionBank = await this.questionBankModel.findOne({ moduleId }).exec();

    if (!questionBank) {
      throw new NotFoundException(`Question bank for module ID '${moduleId}' not found`);
    }

    if (questionIndex < 0 || questionIndex >= questionBank.questions.length) {
      throw new NotFoundException(`Invalid question index '${questionIndex}'`);
    }

    // Remove the specified question
    questionBank.questions.splice(questionIndex, 1);

    await questionBank.save();

    return { message: 'Question deleted successfully' };
  }


  async addQuestionsToBank(moduleId: string, questions: any[]): Promise<QuestionBank> {
    const questionBank = await this.questionBankModel.findOne({ moduleId }).exec();
  
    if (!questionBank) {
      throw new NotFoundException(`Question bank for module ID '${moduleId}' not found.`);
    }
  
    // Validate questions
    questions.forEach((q, index) => {
      if (!q.difficulty) {
        throw new BadRequestException(`Difficulty is required for question ${index + 1}.`);
      }
    });
  
    // Add new questions to the bank
    questionBank.questions.push(...questions);
  
    // Save and return the updated question bank
    return await questionBank.save();
  }
  
  
  
  
}
