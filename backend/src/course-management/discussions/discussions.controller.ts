import { Controller, Get, Post, Patch, Delete, Param, Body, Request, UnauthorizedException } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';

@Controller('courses/:courseId/forums')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Get()
  async getDiscussions(@Param('courseId') courseId: string) {
    console.log('Fetching discussions for Course ID:', courseId);
    return this.discussionsService.getDiscussionsByCourse(courseId);
  }

  @Post()
  async createDiscussion(
    @Param('courseId') courseId: string,
    @Body('title') title: string,
    @Body('content') content: string,
    @Request() req: any,
  ) {
    const { userId, role } = req.user;

    if (role !== 'instructor' && role !== 'student') {
      throw new UnauthorizedException('Only instructors and students can create forums.');
    }

    console.log('Creating discussion:', { courseId, userId, role, title, content });
    return this.discussionsService.createDiscussion(courseId, userId, role, title, content);
  }

  @Patch(':forumId')
  async editDiscussion(
    @Param('courseId') courseId: string,
    @Param('forumId') forumId: string,
    @Body('title') title: string,
    @Body('newContent') newContent: string,
    @Request() req: any,
  ) {
    const { userId, role } = req.user;

    console.log('Editing discussion:', { courseId, forumId, userId, role, title, newContent });
    return this.discussionsService.editDiscussion(forumId, userId, role, title, newContent);
  }

  @Delete(':forumId')
async deleteDiscussion(
  @Param('courseId') courseId: string,
  @Param('forumId') forumId: string,
  @Request() req: any,
) {
  const { userId, role } = req.user;
  console.log('Received request to delete forum:', { courseId, forumId, userId, role });

  try {
    return await this.discussionsService.deleteDiscussion(forumId, userId, role);
  } catch (error) {
    console.error('Error in deleteDiscussion:', error.message);
    throw error;
  }
  
}

  @Post(':forumId/comments')
  async createComment(
    @Param('courseId') courseId: string,
    @Param('forumId') forumId: string,
    @Body('content') content: string,
    @Request() req: any,
  ) {
    const { userId, role } = req.user;

    console.log('Creating comment:', { userId, role, courseId, forumId, content });
    return this.discussionsService.createComment(forumId, userId, role, content);
  }

  @Get(':forumId/comments')
  async getComments(@Param('forumId') forumId: string) {
    console.log('Fetching comments for Forum ID:', forumId);
    return this.discussionsService.getCommentsByForum(forumId);
  }

  @Delete(':forumId/comments/:commentId')
  async deleteComment(
    @Param('forumId') forumId: string,
    @Param('commentId') commentId: string,
    @Request() req: any,
  ) {
    const { userId, role } = req.user;

    console.log('Deleting comment:', { forumId, commentId, userId, role });
    return this.discussionsService.deleteComment(commentId, forumId, userId, role);
  }
}