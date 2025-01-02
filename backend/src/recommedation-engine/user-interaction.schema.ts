import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserInteractionDocument = UserInteraction & Document;

@Schema()
export class UserInteraction {

    @Prop({ required: true, unique: true })
    interactionId: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    courseId: string;

    @Prop({ required: true })
    score: number;

    @Prop({ required: true })
    timeSpentMinutes: number;

    @Prop({ required: true })
    lastAccessed: Date;
}

export const UserInteractionSchema = SchemaFactory.createForClass(UserInteraction);