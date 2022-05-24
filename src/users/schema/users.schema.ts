import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

type Avatar = {
  url: string;
  public_id: string;
};

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  nickName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Object })
  avatar?: Avatar;

  @Prop({ ref: 'posts', default: [] })
  posts: Types.ObjectId[];

  @Prop({ ref: 'users', default: [] })
  friends: Types.ObjectId[];

  @Prop({ ref: 'users', default: [] })
  pendingFriendRequests: Types.ObjectId[];

  @Prop({ ref: 'users', default: [] })
  friendsRequests: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
