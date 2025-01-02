import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forwardRef } from '@nestjs/common';
import { Course, CourseDocument } from './course.schema';
import { CreateCourseDto } from './dots/create-course.dto';
import { UpdateCourseDto } from './dots/update-course.dto';
import { StudentDocument } from './student.schema';
import { Instructor, InstructorDocument } from './instructor.schema';
import { AddMultimediaDto } from './dots/add-multimedia.dto';
import { UserService } from 'src/user-managment/user.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class CourseService {
  constructor(

 
  @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  @InjectModel('Student') private studentModel: Model<StudentDocument>,
  @InjectModel('Instructor') private instructorModel: Model<Instructor>, 
  @Inject(forwardRef(() => UserService)) // Use forwardRef to resolve circular dependency
  private readonly userService: UserService,
){}

async createCourse(createCourseDto: CreateCourseDto, instructorId: string): Promise<Course> {
  try {
    // Create a new course document using the provided data.
    const newCourse = await this.courseModel.create(createCourseDto);

    // Fetch the instructor by ID and await the result
    const instructor = await this.userService.getUserById(instructorId);

    // Check if the user is an instructor
    if (instructor.role === 'instructor') {
      // Add the new course to the instructor's 'createdCourses' array
      const instructorTyped = instructor as Instructor;
      instructorTyped.createdCourses = [...instructorTyped.createdCourses, newCourse];

      // Save the updated instructor

    } else {
      throw new Error('User is not an instructor');
    }

    return newCourse; // Return the created course.
  } catch (error) {
    throw new Error(`Error creating course: ${error.message}`);

  }
}



 

async updateINS(courseId: string, instructorId: string): Promise<void> {
  try {

    const courseExists = await this.courseModel.exists({ courseId });
    if (!courseExists) {
      throw new Error(`Course with ID ${courseId} does not exist`);
    }
    // Fetch the course by ID
    const course = await this.getCourseById(courseId);
    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    // Fetch the instructor by ID
    const instructor = await this.userService.getUserById(instructorId);
    if (!instructor) {
      throw new Error(`Instructor with ID ${instructorId} not found`);
    }

    // Check if the user is an instructor
    if (instructor.role !== 'instructor') {
      throw new Error(`User with ID ${instructorId} is not an instructor.`);
    }

    const instructorTyped = instructor as Instructor;

    // Check if the course is already in the instructor's `createdCourses` array
    const isCourseAlreadyAdded = instructorTyped.createdCourses.some(
      (createdCourse) => createdCourse.courseId === courseId,
    );

    if (!isCourseAlreadyAdded) {
      // Update the `createdCourses` array to include the course
      await this.instructorModel.updateOne(
        { userId: instructorId }, // Match by instructor ID
        { $push: { createdCourses: course } }, // Push the full course object to the array
      );

      console.log(`Course with ID ${courseId} successfully added to instructor's createdCourses.`);
    } else {
      console.log(`Course with ID ${courseId} is already in instructor's createdCourses.`);
    }
  } catch (error) {
    console.error('Error in updateINS:', error.message);
    throw error;
  }
}




  async getAllCourses(): Promise<Course[]> {
    // Query the database to fetch all courses.
    return this.courseModel.find().exec();
  }


  async updateCourse(courseId: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    // Find the course in the database by its unique courseId.
    const course = await this.courseModel.findOne({ courseId });
    if (!course) {
      // If the course does not exist, throw an error.
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }




    // Create a new version snapshot of the current course state.
    const newVersion = {
      version: `v${course.versions.length + 1}`, // Increment the version number.
      content: { ...course.toObject() }, // Clone the current course state.
      updatedAt: new Date(), // Timestamp for the new version.
    };
    course.versions.push(newVersion); // Add the new version to the versions array.

    // Apply the updates from the UpdateCourseDto to the course document.
    Object.assign(course, updateCourseDto);

    // Save the updated course document to the database.
    return course.save();
  }


  async revertToVersion(courseId: string, version: string): Promise<Course> {
    try {
      // Find the course by its unique courseId
      const course = await this.courseModel.findOne({ courseId });
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found.`);
      }

      // Find the specific version in the course's versions array
      const versionData = course.versions.find((v) => v.version === version);
      if (!versionData) {
        throw new NotFoundException(`Version ${version} not found for course ${courseId}.`);
      }

      console.log('Reverting to version data:', versionData);

      // Clone the content of the selected version and exclude the versions field
      const restoredContent = { ...versionData.content };
      delete restoredContent.versions;

      // Apply the restored content to the course without creating a new version
      Object.assign(course, restoredContent);

      // Save the updated course document to the database
      return course.save();
    } catch (error) {
      console.error('Error in revertToVersion:', error.message);
      throw new InternalServerErrorException(`Failed to revert course version: ${error.message}`);
    }
  }





  async getVersions(courseId: string): Promise<Array<{ version: string; updatedAt: Date }>> {
    // Find the course by its unique courseId.
    const course = await this.courseModel.findOne({ courseId });
    if (!course) {
      // If the course does not exist, throw an error.
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }

    // Map the versions array to include only version and updatedAt fields.
    return course.versions.map(({ version, updatedAt }) => ({ version, updatedAt }));
  }



  // Add a multimedia resource to a course
  async addMultimedia(courseId: string, multimediaDto: AddMultimediaDto): Promise<Course> {
    const course = await this.courseModel.findOne({ courseId });
    if (!course) throw new NotFoundException('Course not found');

    // Ensure multimedia field is initialized as an array
    if (!Array.isArray(course.multimedia)) {
      course.multimedia = [];
    }

    // Check if multimedia with the same URL already exists
    const exists = course.multimedia.some((media) => media.url === multimediaDto.url);
    if (exists) throw new Error('Multimedia resource with this URL already exists.');

    // Add the multimedia resource with a default uploadedAt value
    const multimediaWithUploadedAt = {
      ...multimediaDto,
      uploadedAt: multimediaDto.uploadedAt || new Date(), // Assign a default date if not provided
    };

    course.multimedia.push(multimediaWithUploadedAt);
    return course.save();
  }


  async getStudentEnrolledCourses(studentId: string): Promise<any[]> {
    const student = await this.studentModel.findOne({ userId: studentId }).exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Debug enrolled courses
    console.log('Enrolled Courses:', student.enrolledCourses);

    // Fetch all courses the student is enrolled in
    const enrolledCourses = await this.courseModel
      .find({
        courseId: { $in: student.enrolledCourses }, // Match courses based on the student's enrolled courses
      })
      .exec();

    console.log('Fetched Enrolled Courses:', enrolledCourses);

    return enrolledCourses;
  }


  async getCourseById(courseId: string): Promise<Course> {
    try {
      // Query the database for the course with the given courseId
      const course = await this.courseModel.findOne({ courseId }).exec();

      // If no course is found, throw a NotFoundException
      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      return course; // Return the found course
    } catch (error) {
      // Handle unexpected errors and log for debugging
      console.error('Error retrieving course:', error.message);

      if (error instanceof NotFoundException) {
        throw error; // Rethrow if it's a NotFoundException
      }

      throw new InternalServerErrorException('Error retrieving course');
    }
  }



  

  async courseExists(courseId: string): Promise<boolean> {
    try {
      // Try to find the course by its ID
      const course = await this.courseModel.findOne({ courseId });

      // Return true if course exists, false otherwise
      return course !== null;
    } catch (error) {
      // Handle any potential errors (e.g., database issues)
      console.error('Error checking if course exists:', error);
      return false; // Return false if there was an error
    }
  }


  // Remove a multimedia resource from a course
  async removeMultimedia(courseId: string, multimediaId: string): Promise<Course> {
    const course = await this.courseModel.findOne({ courseId });
    if (!course) throw new NotFoundException('Course not found');

    course.multimedia = course.multimedia.filter((media) => media._id.toString() !== multimediaId);
    return course.save();
  }

  // Get all multimedia resources for a course
  async getMultimedia(courseId: string): Promise<Array<{ resourceType: string; url: string; title: string }>> {
    const course = await this.courseModel.findOne({ courseId });
    if (!course) throw new NotFoundException('Course not found');

    return course.multimedia;
  }



  async searchCourses(query: string, limit = 10, skip = 0): Promise<Course[]> {
    return this.courseModel
      .find({
        $or: [
          { courseId: { $regex: query, $options: 'i' } }, // Search by course ID
          { title: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { createdBy: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(limit)
      .skip(skip)
      .exec();
  }
  




  /**
   * Fetch all courses a student is enrolled in.
   * @param userId - The student userId.
   * @returns List of courses the student is enrolled in.
   */
  async getAllEnrolledCourses(userId: string): Promise<any[]> {
    const student = await this.studentModel.findOne({ userId }).exec();

    if (!student) {
      throw new NotFoundException(`Student with ID ${userId} not found`);
    }

    // Fetch all courses the student is enrolled in
    const enrolledCourses = await this.courseModel
      .find({
        courseId: { $in: student.enrolledCourses }, // Match courses based on enrolled IDs
      })
      .exec();

    return enrolledCourses;
  }


  async searchInstructors(query: string, limit = 10, skip = 0): Promise<any[]> {
    return this.instructorModel
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { userId: { $regex: query, $options: 'i' } }, // Use userId instead of id
        ],
      })
      .limit(limit)
      .skip(skip)
      .exec();
  }


  /**
   * Get courses ordered by creation date.
   * @param order - 'asc' or 'desc'.
   * @returns Ordered list of courses.
   */
  async getCoursesOrderedByDate(order: 'asc' | 'desc'): Promise<Course[]> {
    return this.courseModel.find().sort({ createdAt: order === 'asc' ? 1 : -1 }).exec();
  }

  /**
   * Fetch completed courses for a student.
   * @param studentId - The ID of the student.
   * @returns A list of completed courses.
   */
  async getCompletedCourses(studentId: string): Promise<any[]> {
    const student = await this.studentModel.findOne({ userId: studentId }).exec();

    if (!student) {
      throw new NotFoundException(`Student with ID '${studentId}' not found.`);
    }

    // Map completed courses with additional metadata
    const completedCourseDetails = await Promise.all(
      student.completedCourses.map(async (completedCourse) => {
        const course = await this.courseModel.findOne({ courseId: completedCourse.courseId }).exec();
        return {
          ...course.toObject(),
          completionDate: completedCourse.completionDate,
          score: completedCourse.score,
        };
      }),
    );

    return completedCourseDetails;
  }


  async getStudentsWhoCompletedCourse(instructorId: string, courseId: string): Promise<any[]> {
    // Validate that the course exists and is created by the instructor
    const course = await this.courseModel.findOne({ courseId, createdBy: instructorId }).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID '${courseId}' not found or you are not the creator.`);
    }

    // Find all students who have completed the course
    const students = await this.studentModel
      .find({ 'completedCourses.courseId': courseId }, { name: 1, email: 1, 'completedCourses.$': 1 })
      .exec();

    if (!students || students.length === 0) {
      throw new NotFoundException(`No students have completed the course with ID '${courseId}'.`);
    }

    return students.map((student) => ({
      name: student.name,
      email: student.email,
      completionDate: student.completedCourses[0].completionDate,
      score: student.completedCourses[0].score,
    }));
  }
  
  async addKeywordsToCourse(courseId: string, keywords: string[], instructorId: string): Promise<any> {
    const course = await this.courseModel.findOne({ courseId }).exec();
  
    if (!course) {
      throw new NotFoundException(`Course with ID '${courseId}' not found`);
    }
  
    if (course.createdBy !== instructorId) {
      throw new UnauthorizedException('You are not authorized to add keywords to this course');
    }
  
    course.keywords = Array.from(new Set([...(course.keywords || []), ...keywords])); // Avoid duplicates
    return await course.save();
  }
  



}



