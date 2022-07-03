import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from '../post-schema';

export type UserDocument = User & mongoose.Document;

export type Avatar = {
  url: string;
  public_id: string;
};

@Schema()
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  nickname: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Object })
  avatar: Avatar;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'User',
    default: [],
  })
  friends: Array<mongoose.Schema.Types.ObjectId | User>;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'User',
    default: [],
  })
  pendingFriendRequests: Array<mongoose.Schema.Types.ObjectId | User>;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'User',
    default: [],
  })
  friendRequests: Array<mongoose.Schema.Types.ObjectId | User>;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Post',
    default: [],
  })
  postsLikes: Array<mongoose.Schema.Types.ObjectId | Post>;
}

export const UserSchema = SchemaFactory.createForClass(User);
