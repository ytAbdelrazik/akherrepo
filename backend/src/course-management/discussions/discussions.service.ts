import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discussion } from './discussions.schema';
import { Comment } from './comments.schema';
import { Course } from 'src/course-management/course.schema';
import { NotificationService } from 'src/notifications/notifications.service';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<Discussion>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    private readonly notificationService: NotificationService,
  ) {}

  private async validateCourse(courseId: string): Promise<void> {
    const course = await this.courseModel.findOne({ courseId }).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} does not exist.`);
    }
  }

  async getDiscussionsByCourse(courseId: string): Promise<Discussion[]> {
    await this.validateCourse(courseId);
    return this.discussionModel.find({ courseId }).sort({ createdAt: -1 }).exec();
  }

  async createDiscussion(
    courseId: string,
    userId: string,
    role: string,
    title: string,
    content: string,
  ): Promise<Discussion> {
    await this.validateCourse(courseId);
    const newDiscussion = new this.discussionModel({ courseId, userId, role, content, title });
    return newDiscussion.save();
  }

  async editDiscussion(
    forumId: string,
    userId: string,
    role: string,
    title: string,
    newContent: string,
  ): Promise<Discussion> {
    const forum = await this.discussionModel.findById(forumId).exec();
    if (!forum) {
      throw new NotFoundException(`Forum with ID ${forumId} does not exist.`);
    }

    if (forum.userId !== userId && role !== 'instructor') {
      throw new UnauthorizedException(`You are not authorized to edit this forum.`);
    }

    forum.content = newContent;
    forum.title = title;
    return forum.save();
  }

  async deleteDiscussion(forumId: string, userId: string, role: string): Promise<void> {
    console.log('Attempting to delete forum:', { forumId, userId, role });
    
    const forum = await this.discussionModel.findById(forumId).exec();
    if (!forum) {
      console.error(`Forum with ID ${forumId} not found.`);
      throw new NotFoundException(`Forum with ID ${forumId} does not exist.`);
    }
  
    if (role !== 'instructor' && forum.userId !== userId) {
      console.error('Unauthorized deletion attempt.');
      throw new UnauthorizedException(`You are not authorized to delete this forum.`);
    }
  
    await this.discussionModel.deleteOne({ _id: forumId }).exec();
    console.log('Forum deleted successfully.');
  }

  async getCommentsByForum(forumId: string): Promise<Comment[]> {
    return this.commentModel.find({ forumId }).sort({ createdAt: -1 }).exec();
  }

  async createComment(
    forumId: string,
    userId: string,
    role: string,
    content: string,
  ): Promise<Comment> {
    const newComment = new this.commentModel({ forumId, userId, role, content });
    return newComment.save();
  }

  async deleteComment(commentId: string, forumId: string, userId: string, role: string): Promise<void> {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} does not exist.`);
    }

    const forum = await this.discussionModel.findById(forumId).exec();
    if (!forum) {
      throw new NotFoundException(`Forum with ID ${forumId} does not exist.`);
    }

    if (role !== 'instructor' && comment.userId !== userId && forum.userId !== userId) {
      throw new UnauthorizedException(`You are not authorized to delete this comment.`);
    }

    await this.commentModel.deleteOne({ _id: commentId }).exec();
  }
}