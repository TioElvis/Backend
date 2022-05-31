import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Post } from './post.schema';

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

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Post.name }],
    default: [],
  })
  posts: Post[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Post.name }],
    default: [],
  })
  postsThatILike: Post[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: User.name }],
    default: [],
  })
  friends: User[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: User.name }],
    default: [],
  })
  pendingFriendRequests: User[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: User.name }],
    default: [],
  })
  friendRequests: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
