import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Comment } from '../comment-schema';
import { User } from '../user-schema';

export type PostDocument = Post & mongoose.Document;

export type Image = {
  url: string;
  public_id: string;
};

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId | User;

  @Prop({ type: Object, default: {} })
  image: Image;

  @Prop({ type: String, trim: true, default: '' })
  description: string;

  @Prop({ type: Boolean, default: true })
  isComment: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    default: [],
  })
  comments: Array<mongoose.Schema.Types.ObjectId | Comment>;

  @Prop({ type: Boolean, default: true })
  isLikes: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likes: Array<mongoose.Schema.Types.ObjectId | User>;
}

export const PostSchema = SchemaFactory.createForClass(Post);
