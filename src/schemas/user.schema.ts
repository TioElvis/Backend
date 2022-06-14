import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from './post.schema';

export type UserDocument = User & mongoose.Document;

type Avatar = {
  url: string;
  public_id: string;
};

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  nickName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Object, default: {} })
  avatar?: Avatar;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
    default: [],
  })
  postsThatILike: Post[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  friends: User[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  pendingFriendRequests: User[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  friendRequests: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
