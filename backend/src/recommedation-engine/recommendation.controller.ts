import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async createRecommendation(
    @Body('userId') userId: string,
    @Body('recommendedItems') recommendedItems: string[],
  ) {
    return this.recommendationService.createRecommendation(userId, recommendedItems);
  }

  
}
