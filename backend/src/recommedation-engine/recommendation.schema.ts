import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/user-managment/users.schema'; // Assuming the User schema exists
import * as mongoose from 'mongoose';

export type RecommendationDocument = HydratedDocument<Recommendation>;

@Schema()
export class Recommendation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User; // Associated user entity

  @Prop({ type: [String], required: true })
  recommendedItems: string[]; // Array of recommended courses/modules

  @Prop({ type: Date, default: Date.now })
  generatedAt: Date; // Timestamp of recommendation generation
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
