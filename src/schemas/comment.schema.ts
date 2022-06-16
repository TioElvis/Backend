import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from './user.schema';

export type CommentDocument = Comment & mongoose.Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId | User;

  @Prop({ type: String, default: '', trim: true, required: true })
  description: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
