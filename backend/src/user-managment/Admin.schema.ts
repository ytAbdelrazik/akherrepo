import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './users.schema'; // Import the User class
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin extends User {

}

export const AdminSchema = SchemaFactory.createForClass(Admin);
