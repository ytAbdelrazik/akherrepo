import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
  BadRequestException,
  Controller, Get, Param, Logger
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as csvWriter from 'csv-writer';
import { UpdateProgressDto } from './dtos/update-progress.dto';
import { Progress } from './progress.schema';
import { UserInteraction } from 'src/recommedation-engine/user-interaction.schema';
import { Response ,ResponseDocument} from 'src/interactive-modules/responses.schema';
import { Course } from 'src/course-management/course.schema';
import { Module } from 'src/course-management/module.schema';
import { Quiz } from 'src/interactive-modules/quizzes.schema';
import { User } from 'src/user-managment/users.schema';
import { Response as ExpressResponse } from 'express';
import { Rating } from './modulerating.schema';

import * as os from 'os';
import { InstructorRating } from './instructorrating.schema';

@Injectable()
export class PerformanceTrackingService {

  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<Progress>,
    @InjectModel(UserInteraction.name) private readonly userInteractionModel: Model<UserInteraction>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(Module.name) private readonly moduleModel: Model<Module>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Response.name) private readonly responseModel: Model<Response>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
    @InjectModel(InstructorRating.name) private readonly instructorRatingModel: Model<InstructorRating>
  ) {}

  async getProgressByUser(userId: string): Promise<Progress[]> {
    const progress = await this.progressModel.find({ userId }).exec();
    if (progress.length === 0) {
      throw new NotFoundException('No progress found for this user.');
    }
    return progress;
  }
  async updateProgress(progressId: string, updateProgressDto: UpdateProgressDto): Promise<Progress> {
    const progress = await this.progressModel.findOneAndUpdate(
      { progressId }, // Query based on progressId (string field)
      { $set: updateProgressDto }, // Apply the updates from DTO
      { new: true } // Return the updated document
    ).exec();
  
    if (!progress) {
      throw new NotFoundException('Progress not found to update.');
    }
  
    return progress;
  }
  
  private readonly logger = new Logger(PerformanceTrackingService.name);

  async deleteProgress(progressId: string): Promise<void> {
    const result = await this.progressModel.findOneAndDelete({ progressId }).exec(); // Query by progressId
    if (!result) {
      throw new NotFoundException('Progress not found to delete.');
    }
  }
  
  async addRating(
    userId: string,
    courseId: string,
    moduleId: string | null,
    rating: number,
  ): Promise<Rating> {
    // Validate that the user exists
    const userExists = await this.userModel.exists({ userId });
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
  
    // Validate that the course exists
    const courseExists = await this.courseModel.exists({ courseId });
    if (!courseExists) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
  
    // Validate that the module exists (if provided)
    if (moduleId) {
      const moduleExists = await this.moduleModel.exists({ moduleId });
      if (!moduleExists) {
        throw new NotFoundException(`Module with ID ${moduleId} not found.`);
      }
    }
  
    // Create and save the rating
    const newRating = new this.ratingModel({ userId, courseId, moduleId, rating });
    return newRating.save();
  }
  
  async getAverageRatingForCourse(courseId: string): Promise<number> {
    const result = await this.ratingModel.aggregate([
      {
        $lookup: {
          from: 'modules',             // Modules collection
          localField: 'moduleId',       // field in ratings collection
          foreignField: 'moduleId',     // field in modules collection (ensure it's a string)
          as: 'module',                 // alias for the matched modules
        },
      },
      { $unwind: '$module' },             // Unwind the matched modules
      { $match: { 'module.courseId': courseId } }, // Match courseId from modules
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },  // Calculate the average rating
        },
      },
    ]);
  
    if (!result.length) {
      throw new NotFoundException('No ratings found for this course.');
    }
  
    return result[0].averageRating;
  }
  
  async getModuleRatings(courseId: string): Promise<any[]> {
    const result = await this.ratingModel.aggregate([
      {
        $lookup: {
          from: 'modules',              // modules collection
          localField: 'moduleId',        // field in the ratings collection (string)
          foreignField: 'moduleId',      // field in the modules collection (string)
          as: 'module',                  // alias for the matched modules
        },
      },
      { $unwind: '$module' },            // Unwind the matched module array
      { 
        $match: { 
          'module.courseId': courseId    // Match courseId in the module collection
        },
      },
      {
        $group: {
          _id: '$moduleId',              // Group by moduleId
          averageRating: { $avg: '$rating' }, // Calculate the average rating for each module
        },
      },
    ]);
  
    return result;
  }



  async addInstructorRating(
  userId: string,
  instructorId: string,
  courseId: string,
  rating: number,
): Promise<InstructorRating> {
  // Ensure the rating user exists
  const ratingUser = await this.userModel.findOne({ userId });
  if (!ratingUser) {
    throw new NotFoundException('User not found.');
  }

  // Ensure the rated instructor exists and has the role "instructor"
  const instructor = await this.userModel.findOne({ userId: instructorId });
  if (!instructor || instructor.role !== 'instructor') {
    throw new NotFoundException('Instructor not found.');
  }

  // Prevent students from rating other students or admins
  if (ratingUser.role !== 'student') {
    throw new BadRequestException('Only students can rate instructors.');
  }

  // Check if the student has already rated this instructor
  const existingRating = await this.instructorRatingModel.findOne({
    userId,
    instructorId,
  });
  if (existingRating) {
    throw new BadRequestException('You have already rated this instructor.');
  }

  // Create the new rating
  const newRating = new this.instructorRatingModel({
    userId,
    instructorId,
    courseId,
    rating,
  });

  return newRating.save();
}

async getAverageRatingForInstructor(instructorId: string): Promise<number> {
  console.log('Searching for ratings with instructorId:', instructorId);

  const result = await this.instructorRatingModel.aggregate([
    {
      $match: { instructorId: instructorId },
    },
    {
      $group: {
        _id: '$instructorId',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  console.log('Query result:', result);

  if (!result.length) {
    throw new NotFoundException('No ratings found for this instructor.');
  }

  return result[0].averageRating;
}

  //* Create Progress Record
  async createProgress(progressDto: UpdateProgressDto): Promise<Progress> {
    const { userId, courseId } = progressDto;

    const existingProgress = await this.progressModel.findOne({ userId, courseId }).exec();
    if (existingProgress) {
      throw new ConflictException('Progress already exists for this course and user.');
    }

    const interaction = await this.userInteractionModel.findOne({ userId, courseId }).exec();

    if (!interaction) {
      const course = await this.courseModel.findOne({ courseId: courseId }).exec();
      if (!course) {
        throw new NotFoundException('Course not found. Please verify the course ID.');
      }

      const progress = new this.progressModel({
        ...progressDto,
        completionPercentage: 0,
        lastAccessed: new Date(),
      });

      return progress.save();
    }

    throw new HttpException('Unexpected error occurred while creating progress.', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /* Calculate Progress for a Course
  async calculateProgress(userId: string, courseId: string): Promise<{ completionPercentage: number; lastAccessed: Date }> {
    const course = await this.courseModel.findOne({ _id: courseId }).exec();
    if (!course) {
      throw new NotFoundException('Course not found. Please verify the course ID.');
    }

    const modules = await this.moduleModel.find({ courseId }).exec();
    const quizzes = await this.quizModel.find({ courseId }).exec();

    if (!modules.length && !quizzes.length) {
      throw new NotFoundException('No modules or quizzes found for this course.');
    }

    const interactions = await this.userInteractionModel.find({ userId, courseId }).exec();

    if (!interactions.length) {
      return { completionPercentage: 0, lastAccessed: new Date() };
    }

    const completedModules = interactions.filter((interaction) => interaction.timeSpentMinutes > 0).length;
    const completedQuizzes = interactions.filter((interaction) => interaction.score > 0).length;

    const totalModules = modules.length;
    const totalQuizzes = quizzes.length;

    const completionPercentage = Math.floor(
      ((completedModules + completedQuizzes) / (totalModules + totalQuizzes)) * 100
    );

    return {
      completionPercentage,
      lastAccessed: interactions[interactions.length - 1].lastAccessed || new Date(),
    };
  }
*/
  // Get All Progress Records
  async getAllProgress(): Promise<Progress[]> {
    const progress = await this.progressModel.find().exec();
    if (!progress.length) {
      throw new NotFoundException('No progress records found.');
    }
    return progress;
  }
  async getQuizPerformanceByQuizId(quizId: string): Promise<any> {
    const quizScores = await this.responseModel.aggregate([
      { $match: { quizId: quizId } }, // Filter by quizId
      {
        $group: {
          _id: '$quizId',
          totalResponses: { $count: {} }, // Total responses for the quiz
          averageScore: { $avg: '$score' }, // Average score for the quiz
          highestScore: { $max: '$score' }, // Highest score for the quiz
          lowestScore: { $min: '$score' }, // Lowest score for the quiz
        },
      },
    ]);

    if (!quizScores.length) {
      throw new NotFoundException('No responses found for this quiz.');
    }

    return quizScores[0]; // Return the performance data for the quiz
  }
  async getStudentQuizPerformance(quizId: string, userId: string): Promise<any> {
    const studentScore = await this.responseModel.findOne({ quizId, userId }).exec();

    if (!studentScore) {
      throw new NotFoundException('No response found for this quiz and student.');
    }

    return {
      quizId,
      userId,
      score: studentScore.score,
      submittedAt: studentScore.submittedAt,
    };
  }

  async getStudentDashboard(studentId: string): Promise<any> {
    // Step 1: Fetch all progress data for the student
    const progressData = await this.progressModel.find({ userId: studentId }).exec();

    if (!progressData.length) {
      throw new NotFoundException('No progress data found for this student.');
    }

    // Step 2: Aggregate course completion data directly from the progress schema
    const courseCompletions = progressData.map((progress) => ({
      courseId: progress.courseId,
      completionPercentage: progress.completionPercentage,
      lastAccessed: progress.lastAccessed,
    }));

    // Step 3: Calculate average performance score
    const allScores = await this.userInteractionModel.find({ userId: studentId }).exec();
    const averageScore =
      allScores.reduce((sum, interaction) => sum + (interaction.score || 0), 0) / allScores.length;

    // Step 4: Gather quiz performance metrics
    const quizzes = await this.responseModel.find({ userId: studentId }).exec();
    const quizPerformances = quizzes.map((quiz) => ({
      quizId: quiz.quizId,
      score: quiz.score,
      submittedAt: quiz.submittedAt,
    }));

    // Step 5: Prepare the final dashboard data
    return {
      studentId,
      courseCompletions, // List of course completion percentages and last accessed dates
      averageScore: Number(averageScore.toFixed(2)), // Keep 2 decimal places
      quizPerformances,
    };
  }
  // Ensure correct import

  
    async exportAnalytics(
      courseId: string, 
      userId: string, 
      format: string, 
      res: ExpressResponse
    ): Promise<void> {
      try {
        console.log('Starting export for courseId:', courseId, 'userId:', userId, 'format:', format);
  
        // Fetch course analytics
        const data = await this.getCourseAnalytics(courseId);
  
        console.log('Course Analytics:', data);
  
        // Default values for ratings
        let averageCourseRating = 'Rating not found';
        let moduleRatings = 'Rating not found';
        let averageInstructorRating = 'Rating not found';
  
        // Get the course rating
        try {
          averageCourseRating = String(await this.getAverageRatingForCourse(courseId));
          console.log(`Average Course Rating for ${courseId}:`, averageCourseRating);
        } catch (error) {
          console.error(`Error fetching course rating for courseId ${courseId}:`, error);
        }
  
        // Get the module ratings
        try {
          const moduleRatingData = await this.getModuleRatings(courseId);
          moduleRatings = moduleRatingData
            .map((module: any) => `Module ${module._id}: ${module.averageRating}`)
            .join(', ');
          console.log('Module Ratings:', moduleRatings);
        } catch (error) {
          console.error(`Error fetching module ratings for courseId ${courseId}:`, error);
        }
  
        // Get the instructor rating based on userId
        try {
          averageInstructorRating = String(await this.getAverageRatingForInstructor(userId));
          console.log(`Instructor Rating for ${userId}:`, averageInstructorRating);
        } catch (error) {
          console.error(`Error fetching instructor rating for userId ${userId}:`, error);
        }
  
        // Add ratings data to the course data object
        data.averageCourseRating = averageCourseRating;
        data.moduleRatings = moduleRatings;
        data.averageInstructorRating = averageInstructorRating;
  
        console.log('Final Data for Export:', data);
  
        // Custom directory for CSV file storage
        const customDirectory = '/Users/hamzarateb/UNIVERSITY/SoftwareProject/SoftwareProject/src/performance-tracking/dtos'; // Change this to your desired path
        const fileName = `${courseId}-analytics-${Date.now()}.csv`;
        const csvPath = path.join(customDirectory, fileName);
  
        console.log('CSV Path:', csvPath);
        data.CourseId = courseId;

        // Create CSV writer instance
        const csv = csvWriter.createObjectCsvWriter({
          path: csvPath,
          header: [
            { id: '_id', title: 'Course ID' },
            { id: 'averageCompletion', title: 'Average Completion (%)' },
            { id: 'activeStudents', title: 'Active Students' },
            { id: 'averageCourseRating', title: 'Average Course Rating' },
            { id: 'averageInstructorRating', title: 'Average Instructor Rating' },
            { id: 'performanceCategories.belowAverage', title: 'Students Below Average' },
            { id: 'performanceCategories.average', title: 'Students Average' },
            { id: 'performanceCategories.aboveAverage', title: 'Students Above Average' },
            { id: 'performanceCategories.excellent', title: 'Students Excellent' },
            { id: 'moduleRatings', title: 'Module Ratings' },
          ],
        });
  
        // Write the data to CSV
        console.log('Writing data to CSV...');
        await csv.writeRecords([data]);
  
        console.log('Data written to CSV. File path:', csvPath);
  
        // Send the CSV file as a response
        res.download(csvPath, fileName, (err) => {
          if (err) {
            console.error('Error during file download:', err);
            if (!res.headersSent) {
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while exporting the file.' });
            }
          } else {
            console.log('File download complete. Cleaning up file...');
            // Delete the file after sending it
            fs.unlinkSync(csvPath);
            console.log('File deleted:', csvPath);
          }
        });
  
        // Ensure no further responses are sent
        return;
  
      } catch (error) {
        console.error('Error exporting analytics:', error);
        // Send error response only if headers are not already sent
        if (!res.headersSent) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while exporting analytics.' });
        }
      }
    }
  

  // Helper function to gather course analytics data
async getCourseAnalytics(courseId: string): Promise<any> {
  // Step 1: Fetch all interactions for the given course
  const interactions = await this.userInteractionModel.find({ courseId }).exec();

  // Step 2: Get students who completed the course (completion rate = 100)
  const studentsCompletedCourse = await this.progressModel
    .find({ courseId, completionRate: 100 })
    .distinct('userId')
    .exec();

  // Step 3: Group interactions by userId
  const studentScores = interactions.reduce((acc, interaction) => {
    if (!acc[interaction.userId]) {
      acc[interaction.userId] = [];
    }
    acc[interaction.userId].push(interaction.score); // Collect scores for each module per student
    return acc;
  }, {});

  // Step 4: Calculate average score for each student in the course
  const performanceCategories = {
    belowAverage: 0,
    average: 0,
    aboveAverage: 0,
    excellent: 0,
  };

  const totalStudents = Object.keys(studentScores).length;
  const scores = interactions.map((interaction) => interaction.score);
  const totalScores = scores.reduce((sum, score) => sum + score, 0);
  const overallAverageScore = totalScores / interactions.length;

  // Step 5: Categorize students based on their average score in the course
  for (const userId in studentScores) {
    const scores = studentScores[userId];
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    if (averageScore < 60) {
      performanceCategories.belowAverage++;
    } else if (averageScore >= 60 && averageScore < 80) {
      performanceCategories.average++;
    } else if (averageScore >= 80 && averageScore < 90) {
      performanceCategories.aboveAverage++;
    } else {
      performanceCategories.excellent++;
    }
  }

  // Step 6: Return the analytics data
  return {
    courseId,
    totalStudents,
    studentsCompletedCourse: studentsCompletedCourse.length, // Based on completion rate
    performanceCategories,
  };
}
}
