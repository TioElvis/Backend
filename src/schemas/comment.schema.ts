import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type CommentDocument = Comment & Document;

const dateNow = new Date();

@Schema()
export class Comment {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
  })
  userId: User;

  @Prop({ trim: true, default: '' })
  description?: string;

  @Prop({ type: Date, default: dateNow })
  date: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
