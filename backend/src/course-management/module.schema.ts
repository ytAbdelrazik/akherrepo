import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema()
export class Module {
  @Prop({ required: true, unique: true })
  moduleId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], required: false })
  resources?: string[];

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
  
  @Prop({ default: false }) // New field to mark as outdated
  isOutdated: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
