import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recommendation, RecommendationDocument } from './recommendation.schema';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(Recommendation.name)
    private recommendationModel: Model<RecommendationDocument>,
  ) {}

  async createRecommendation(userId: string, recommendedItems: string[]): Promise<Recommendation> {
    const recommendation = new this.recommendationModel({
      user: userId,
      recommendedItems,
    });
    return recommendation.save();
  }
}
