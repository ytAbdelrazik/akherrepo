import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discussion } from './discussions.schema';
import { Comment } from './comments.schema';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectModel(Discussion.name) private discussionModel: Model<Discussion>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>, // Inject Comment model
  ) {}

  async getDiscussionsByCourse(courseId: string): Promise<Discussion[]> {
    return this.discussionModel.find({ courseId }).sort({ createdAt: -1 }).exec();
  }

  async createDiscussion(
    courseId: string,
    userId: string,
    role: string,
    content: string,
  ): Promise<Discussion> {
    const newDiscussion = new this.discussionModel({
      courseId,
      userId,
      role,
      content,
    });
    return newDiscussion.save();
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
    const newComment = new this.commentModel({
      forumId,
      userId,
      role,
      content,
    });
    return newComment.save();
  }
}
