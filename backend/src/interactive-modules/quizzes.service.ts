import { Injectable, NotFoundException, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quizzes.schema';
import { Module, ModuleDocument } from '../course-management/module.schema';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { StudentDocument } from 'src/course-management/student.schema';
import { Course, CourseDocument } from 'src/course-management/course.schema';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<QuizDocument>,
    @InjectModel('Module') private readonly moduleModel: Model<ModuleDocument>,
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<any>, // Correct injection
    @InjectModel('Student') private readonly studentModel: Model<StudentDocument>,
    @InjectModel('Course') private readonly courseModel: Model<Course>, // Inject the Course model
  ) {}




  private generateQuestions(count: number, type: 'MCQ' | 'True/False' | 'Both'): { question: string; options: string[]; answer: string }[] {
    const questions = [];

    for (let i = 0; i < count; i++) {
      if (type === 'MCQ' || (type === 'Both' && i % 2 === 0)) {
        questions.push({
          question: `MCQ Question ${i + 1}?`,
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          answer: 'Option 1',
        });
      } else {
        questions.push({
          question: `True/False Question ${i + 1}?`,
          options: ['True', 'False'],
          answer: 'True',
        });
      }
    }

    return questions;
  }


  async createQuiz(moduleId: string, courseId: string, numberOfQuestions: number, questionType: string, difficulty: string): Promise<Quiz> {
    
    const course = await this.courseModel.findOne({ courseId }).exec();
  if (!course) {
    throw new NotFoundException(`Course with ID ${courseId} not found`);
  }
    const module = await this.moduleModel.findOne({ moduleId }).exec();
    
    
    if (!module) {
      throw new NotFoundException(`Module with ID '${moduleId}' not found`);
    }
  
    const existingQuiz = await this.quizModel.findOne({ moduleId }).exec();
    if (existingQuiz) {
      throw new ConflictException(`A quiz for module '${moduleId}' already exists`);
    }
  
    const questionBank = await this.questionBankModel.findOne({ moduleId }).exec();
    if (!questionBank || questionBank.questions.length === 0) {
      throw new NotFoundException(`No question bank found for module '${moduleId}'`);
    }
  
    const filteredQuestions = questionBank.questions.filter((q) => q.type === questionType && q.difficulty === difficulty);
    if (filteredQuestions.length < numberOfQuestions) {
      throw new ConflictException(`Not enough questions available. Found: ${filteredQuestions.length}`);
    }
  
    const selectedQuestions = filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, numberOfQuestions);
  
    const newQuiz = new this.quizModel({
      quizId: `QUIZ-${Date.now()}`,
      moduleId,
      courseId,
      questionType,
      difficulty,
      numberOfQuestions,
      questions: selectedQuestions,
    });
  
    return await newQuiz.save();
  }

  async getQuizzesForCourse(courseId: string): Promise<any[]> {
    const quizzes = await this.quizModel.find({ courseId }).exec();
    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException(`No quizzes found for course with ID ${courseId}`);
    }
    return quizzes;
  }
  
  
  
  async getQuizById(quizId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findOne({ quizId }).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID '${quizId}' not found.`);
    }
    return quiz;
  }
  

  async generateQuizForStudent(quizId: string, studentId: string): Promise<any> {
    const quiz = await this.quizModel.findOne({ quizId }).exec();
  
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID '${quizId}' not found`);
    }
  
    const questionBank = await this.questionBankModel.findOne({ moduleId: quiz.moduleId }).exec();
    if (!questionBank || questionBank.questions.length === 0) {
      throw new NotFoundException(`No question bank found for module '${quiz.moduleId}'`);
    }
  
    // Filter questions based on type and difficulty
    const filteredQuestions = questionBank.questions.filter(
      (q) => q.type === quiz.questionType && q.difficulty === quiz.difficulty,
    );
  
    if (filteredQuestions.length < quiz.numberOfQuestions) {
      throw new ConflictException(
        `Not enough unique questions available for this quiz. Expected: ${quiz.numberOfQuestions}, Found: ${filteredQuestions.length}`,
      );
    }
  
    // Randomize and ensure uniqueness
    const uniqueQuestions = new Set<string>();
    const randomizedQuestions = [];
  
    for (const question of filteredQuestions.sort(() => 0.5 - Math.random())) {
      if (!uniqueQuestions.has(question.questionId)) {
        uniqueQuestions.add(question.questionId);
        randomizedQuestions.push(question);
      }
      if (randomizedQuestions.length === quiz.numberOfQuestions) {
        break;
      }
    }
  
    if (randomizedQuestions.length < quiz.numberOfQuestions) {
      throw new ConflictException(
        `Could not generate enough unique questions. Requested: ${quiz.numberOfQuestions}, Generated: ${randomizedQuestions.length}`,
      );
    }
  
    return {
      quizId: quiz.quizId,
      moduleId: quiz.moduleId,
      questions: randomizedQuestions,
    };
  }
  
  
  
  async generateRandomizedQuiz(moduleId: string, numberOfQuestions: number, questionTypes: string[]): Promise<Quiz> {
    const module = await this.moduleModel.findOne({ moduleId }).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID '${moduleId}' not found`);
    }
  
    const existingQuiz = await this.quizModel.findOne({ moduleId }).exec();
    if (existingQuiz) {
      throw new ConflictException(`A quiz for module '${moduleId}' already exists`);
    }
  
    const questionBank = await this.questionBankModel.findOne({ moduleId }).exec();
    if (!questionBank || questionBank.questions.length === 0) {
      throw new NotFoundException(`No questions found in the question bank for module '${moduleId}'`);
    }
  
    // Track previously used questions for this module
    const usedQuestionIds = (await this.quizModel
      .find({ moduleId })
      .exec())
      .flatMap((quiz) => quiz.questions.map((q) => q.question));
  
    // Filter out used questions
    let filteredQuestions = questionBank.questions.filter((q) => !usedQuestionIds.includes(q.questionId));
  
    if (questionTypes.includes('both')) {
      // Include all types
    } else {
      filteredQuestions = filteredQuestions.filter((q) => questionTypes.includes(q.type));
    }
  
    if (filteredQuestions.length < numberOfQuestions) {
      throw new ConflictException(
        `Not enough new questions available. Requested: ${numberOfQuestions}, Available: ${filteredQuestions.length}`,
      );
    }
  
    const selectedQuestions = filteredQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, numberOfQuestions);
  
    const newQuiz = new this.quizModel({
      quizId: `QZ-${Date.now()}`,
      moduleId,
      questions: selectedQuestions,
    });
  
    return await newQuiz.save();
  }
  

  



  /**
   * Retrieve a quiz associated with a specific module.
   * @param moduleId - The ID of the module.
   * @returns The quiz document.
   * @throws NotFoundException if the quiz is not found.
   */
  async getQuizByModule(moduleId: string): Promise<Quiz> {
    const quiz = await this.quizModel.findOne({ moduleId }).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz for module ID '${moduleId}' not found`);
    }
    return quiz;
  }

  /**
   * Retrieve all quizzes.
   * @returns A list of all quizzes.
   */
  async getAllQuizzes(): Promise<Quiz[]> {
    return this.quizModel.find().exec();
  }


  async updateQuiz(quizId: string, updatedData: Partial<CreateQuizDto>): Promise<Quiz> {
    const quiz = await this.quizModel.findOne({ quizId }).exec();
  
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID '${quizId}' not found`);
    }
  
    if (quiz.isAttempted) {
      throw new ConflictException(`Quiz with ID '${quizId}' cannot be edited as it has been attempted`);
    }
  
    Object.assign(quiz, updatedData);
    return await quiz.save();
  }

  async deleteQuiz(quizId: string): Promise<string> {
    // Retrieve the quiz
    const quiz = await this.quizModel.findOne({ quizId }).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID '${quizId}' not found.`);
    }
  
    // Check if the quiz has been attempted
    if (quiz.isAttempted) {
      throw new ConflictException(
        `Quiz with ID '${quizId}' cannot be deleted because it has already been attempted by students.`
      );
    }
  
    // Delete the quiz
    await this.quizModel.deleteOne({ quizId }).exec();
    return `Quiz with ID '${quizId}' has been successfully deleted.`;
  }

  async getQuizzesForStudentCourses(studentId: string): Promise<any[]> {
    // Fetch the student's enrolled courses
    const student = await this.studentModel.findOne({ userId: studentId }).exec();
  
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
  
    // Fetch quizzes for enrolled courses
    const quizzes = await this.quizModel
      .find({ courseId: { $in: student.enrolledCourses } }) // Match quizzes by courseId
      .exec();
  
    return quizzes;
  }
  

  
  
  
}
