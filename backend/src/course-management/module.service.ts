import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './module.schema';
import { Course } from '../course-management/course.schema';
import { Instructor } from './instructor.schema';
import { CreateModuleDto } from 'src/course-management/dots/create-module.dto';
import { UpdateModuleDto } from './dots/update-module.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel('Module') private readonly moduleModel: Model<ModuleDocument>,
    @InjectModel('Course') private readonly courseModel: Model<Course>,
    @InjectModel('Instructor') private readonly instructorModel: Model<Instructor>,
  ) { }

  /**
   * Validate if the instructor is authorized to create a module for a course.
   * @param userId - Instructor's ID.
   * @param courseId - Course's ID.
   */
  private async validateInstructorForCourse(userId: string, courseId: string): Promise<void> {
    const instructor = await this.instructorModel.findOne({ userId }).exec();
    if (!instructor) {
      throw new UnauthorizedException('Instructor not found');
    }

    const course = await this.courseModel.findOne({ courseId }).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.createdBy !== instructor.name) {
      throw new UnauthorizedException('You are not authorized to create modules for this course');
    }
  }

  /**
   * Create a new module for a course.
   * @param userId - Instructor's ID.
   * @param moduleDto - Module data transfer object.
   * @returns The created module.
   */
  async createModule(userId: string, moduleDto: CreateModuleDto): Promise<Module> {
    // Validate the instructor for the course
    await this.validateInstructorForCourse(userId, moduleDto.courseId);
  
    // Fetch the instructor's details
    const instructor = await this.instructorModel.findOne({ userId }).exec();
  
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID '${userId}' not found`);
    }
  
    // Check for duplicate moduleId within the course
    const existingModule = await this.moduleModel
      .findOne({
        moduleId: moduleDto.moduleId,
        courseId: moduleDto.courseId,
      })
      .exec();
  
    if (existingModule) {
      throw new ConflictException(
        `A module with ID '${moduleDto.moduleId}' already exists for course '${moduleDto.courseId}'.`,
      );
    }
  
    // Add the `createdBy` field with the instructor's name
    const newModule = new this.moduleModel({
      ...moduleDto,
      createdBy: instructor.name, // Automatically set createdBy to the instructor's name
    });
  
    return await newModule.save();
  }
  

  /**
   * Get all modules for a specific course.
   * @param courseId - Course's ID.
   * @returns Array of modules.
   */
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    return this.moduleModel.find({ courseId }).exec();
  }



  /**
  * Edit a module
  * @param userId - The ID of the instructor
  * @param moduleId - The ID of the module to update
  * @param updateData - Data for updating the module
  */
  async updateModule(
    userId: string,
    moduleId: string,
    updateData: any,
  ): Promise<Module> {
    const module = await this.moduleModel.findOne({ moduleId }).exec();
  
    if (!module) {
      throw new NotFoundException(`Module with ID '${moduleId}' not found`);
    }
  
    // Validate ownership
    const course = await this.courseModel.findOne({ courseId: module.courseId }).exec();
    if (!course || course.createdBy !== userId) {
      throw new UnauthorizedException('You are not authorized to update this module');
    }
  
    // Update module fields
    Object.assign(module, updateData);
  
    // Handle `isOutdated` field if included
    if (typeof updateData.isOutdated !== 'undefined') {
      module.isOutdated = updateData.isOutdated;
    }
  
    return await module.save();
  }
  

  /**
 * Get modules ordered by creation date.
 * @param order - 'asc' or 'desc'.
 * @returns Ordered list of modules.
 */
  async getModulesOrderedByDate(order: 'asc' | 'desc'): Promise<Module[]> {
    return this.moduleModel.find().sort({ createdAt: order === 'asc' ? 1 : -1 }).exec();
  }

  async getModulesForStudents(courseId: string): Promise<Module[]> {
    return this.moduleModel.find({ courseId, isOutdated: { $ne: true } }).exec();
  }
  

  

}
