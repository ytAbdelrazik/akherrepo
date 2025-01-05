import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../course-management/student.schema';
import { Instructor } from '../course-management/instructor.schema';
import { User } from './users.schema';
import { Course } from '../course-management/course.schema';  // Ensure Course schema is imported
import { Admin } from './admin.schema';  // Adjust the import path for the Admin schema if necessary
import { CourseService } from 'src/course-management/course.service';
import { UpdateStudentDto } from './dots/UpdateStudent.dto';
import { UpdateInstructorDto } from './dots/UpdateInstructor.dto';
@Injectable()
export class UserService {
  getAllEnrolledCourses(userId: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel("User") private userModel: Model<User>,
    @InjectModel('Student') private readonly studentModel: Model<Student>,
    @InjectModel('Instructor') private readonly instructorModel: Model<Instructor>,
    @InjectModel('Admin') private readonly adminModel: Model<Admin>,
    @InjectModel('Course') private readonly courseModel: Model<Course>,
    private readonly CourseService: CourseService



  ) {}

  async getUserById(userId: string): Promise<Student | Instructor | Admin> {
    console.log(`Fetching user with ID: ${userId}`);

    // Check if the user exists in the student model
    let user = await this.studentModel.findOne({ userId }).exec();
    if (user) {
        // Ensure the returned user is typed as Student
        return user as Student; // Return the student if found
    }

    // Check if the user exists in the instructor model
    let x = await this.instructorModel.findOne({ userId }).exec();
    if (x) {
        // Ensure the returned user is typed as Instructor
        return x as Instructor; // Return the instructor if found
    }

    // Check if the user exists in the admin model
    let y = await this.adminModel.findOne({ userId }).exec();
    if (y) {
        // Ensure the returned user is typed as Admin
        return y as Admin; // Return the admin if found
    }

    // If the user was not found in any model, throw a NotFoundException
    throw new NotFoundException(`User with ID ${userId} not found`);
}


  private getModelByRole(role: string): Model<any> {
    switch (role) {
      case 'student':
        return this.studentModel;
      case 'instructor':
        return this.instructorModel;
      case 'admin':
        return this.adminModel;  // Handle Admin role
      default:
        throw new NotFoundException(`Invalid role: ${role}`);
    }
  }

  private generateUserId(role: string): string {
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    switch (role) {
      case 'student':
        return `ST${randomNumber}`;
      case 'instructor':
        return `IS${randomNumber}`;
      case 'admin':
        return `AD${randomNumber}`;  // Ensure unique ID for admin
      default:
        throw new Error('Invalid role');
    }
  }

  async createUser(userData: any): Promise<any> {
    const model = this.getModelByRole(userData.role);

    // Validate email uniqueness
    const existingUser = await model.findOne({ email: userData.email }).exec();
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Generate a unique userId
    let uniqueUserId = '';
    let isUnique = false;
    while (!isUnique) {
      uniqueUserId = this.generateUserId(userData.role);
      const userIdCheck = await model.findOne({ userId: uniqueUserId }).exec();
      isUnique = !userIdCheck;
    }
    userData.userId = uniqueUserId;

    try {
      return await model.create(userData);
    } catch (error) {
      console.error('Error creating user:', error);

      if (error.code === 11000) {
        throw new ConflictException('Duplicate key error: User already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
  async updateUser(
    userId: string,
    role: string,
    updateData: Partial<UpdateStudentDto | UpdateInstructorDto>
  ): Promise<any> {
    const model = this.getModelByRole(role);
    const user = await model.findOne({ userId }).exec();
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    // Exclude userId from being updated
    if ('userId' in updateData) {
      delete updateData.userId;
    }
  
    // Only check for duplicate email if an email is being updated
    if (updateData.email) {
      const existingUser = await model
        .findOne({
          email: updateData.email,
          userId: { $ne: userId }, // Exclude the current user from duplicate check
        })
        .exec();
  
      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }
    }
  
    // Ensure that undefined fields don't overwrite existing fields
    const updatePayload = { ...user.toObject(), ...updateData };
  
    // Update allowed fields
    Object.assign(user, updatePayload);
    return user.save();
  }
  
  
  
  

  async getAllByRole(role: string): Promise<any[]> {
    const model = this.getModelByRole(role);
    return model.find().exec();
  }

  async getEnrolledCourses(userId: string): Promise<Course[]> {
    const student = await this.studentModel.findOne({ userId }).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${userId} not found`);
    }
    // Return full Course objects, assuming enrolledCourses are references
    return student.enrolledCourses;
  }

  async getCreatedCourses(userId: string): Promise<Course[]> {
    const instructor = await this.instructorModel.findOne({ userId }).exec();
    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${userId} not found`);
    }
    // Return full Course objects, assuming coursesCreated are references
    return instructor.createdCourses;
  }


  async addCoursesToStudent(userId: string, courseIds: string[]): Promise<any> {
    // Fetch the student using the userId
    const student = await this.studentModel.findOne({ userId }).exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${userId} not found`);
    }

    // Fetch the course documents by their courseId
    const courses = await this.courseModel.find({
      courseId: { $in: courseIds },  // Find courses by their courseIds (strings)
    }).exec();


    // Ensure that all courseIds exist in the database
    if (courses.length !== courseIds.length) {
      throw new NotFoundException('One or more courses not found');
    }
    // Avoid duplicates: Use course _id, which are ObjectIds
    const currentCourseIds = student.enrolledCourses.map(course => course.toString()); // Convert enrolled course ObjectIds to string
    const newCourseIds = courseIds.filter(courseId => !currentCourseIds.includes(courseId));  // Avoid adding duplicates

    // Fetch the actual courses to add by their courseIds (assuming courseIds are strings in the input)
    const newCourses = await this.courseModel.find({
      courseId: { $in: newCourseIds },
    }).exec();

    // Add the new courses to the student's enrolled courses
    student.enrolledCourses = [...student.enrolledCourses, ...newCourses];

    // Save the updated student record
    return student.save();
  }


  
  async findByEmail(email: string): Promise<any | null> { //fix when studentModel at first not student will get an error
    const student = await this.studentModel.findOne({ email }).exec();
    if (student) return student;
  
    const instructor = await this.instructorModel.findOne({ email }).exec();
    if (instructor) return instructor;
  
    const admin = await this.adminModel.findOne({ email }).exec();
    return admin;
  }

  
  async searchStudentsByName(name: string, limit: number, offset: number): Promise<Student[]> {
    return this.studentModel
      .find({
        name: { $regex: name, $options: 'i' }, // Case-insensitive search
      })
      .limit(limit)
      .skip(offset)
      .exec();
  }








  async istheinstructorInCourse(courseId: string, instructorId: string): Promise<boolean> {
    // Fetch the list of courses the instructor has created
    const instructorCourses = await this.getCreatedCourses(instructorId);
  
    // Validate if the course exists
    const course = await this.CourseService.getCourseById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
  
    // Check if the course ID exists in the instructor's created courses
    return instructorCourses.some(createdCourse => createdCourse.courseId === course.courseId);
  }
  




  async isStudentEnrolledInCourse(courseId: string, studentId: string): Promise<boolean> {
    // Fetch the list of courses the student is enrolled in
   

    const enrolledCoursess = await this.getEnrolledCourses(studentId);
    const course = await this.CourseService.getCourseById(courseId);
     
    if (!course) {
      throw new Error('Course not found');
    }
    console.log(course.courseId)
    return enrolledCoursess.some(enrolledCourse => enrolledCourse.courseId === course.courseId);

  
  }



  async updateCourseAvailability(courseId: string, isAvailable: boolean): Promise<Course> {
    const course = await this.courseModel.findOne({ courseId }).exec();
  
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
  
    course.isAvailable = isAvailable;
    return course.save();
  }
  //for when the admin wants to update the availability of a course, toggle the bool


  
  async deleteUser(userId: string): Promise<void> {
    // Fetch the user by ID using the getUserById function
    const user = await this.getUserById(userId);
  
    // Check the user's role and delete accordingly
    if (user.role === 'admin') {
      await this.adminModel.deleteOne({ userId }).exec();
    } else if (user.role === 'instructor') {
      await this.instructorModel.deleteOne({ userId }).exec();
    } else if (user.role === 'student') {
      await this.studentModel.deleteOne({ userId }).exec();
    } else {
      // Handle deletion for other roles (if necessary)
      await this.userModel.deleteOne({ userId }).exec();
    }
  }
  
  
  
}
