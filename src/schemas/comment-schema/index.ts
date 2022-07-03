import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from '../post-schema';
import { User } from '../user-schema';

export type CommentDocument = Comment & mongoose.Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId | User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  postId: mongoose.Schema.Types.ObjectId | Post;

  @Prop({
    type: String,
    default: '',
    trim: true,
    required: true,
    maxlength: 24,
  })
  description: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
