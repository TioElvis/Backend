import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Posts } from 'src/routes/posts/schema/posts.schema';

export type UserDocument = Users & Document;

type Avatar = {
  url: string;
  public_id: string;
};

@Schema()
export class Users {
  @Prop({ required: true, unique: true })
  nickName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Object })
  avatar?: Avatar;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Posts.name }],
    default: [],
  })
  posts: Posts[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Posts.name }],
    default: [],
  })
  postsThatILike: Posts[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Posts.name }],
    default: [],
  })
  postsFriends: Posts[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Users.name }],
    default: [],
  })
  friends: Users[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Users.name }],
    default: [],
  })
  pendingFriendRequests: Users[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Users.name }],
    default: [],
  })
  friendsRequests: Users[];
}

export const UserSchema = SchemaFactory.createForClass(Users);
