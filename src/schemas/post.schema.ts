import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type PostDocument = Post & Document;

type Image = {
  url?: string;
  public_id?: string;
};

@Schema()
export class Post {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'users',
  })
  userId: User;

  @Prop({ type: Object, default: {} })
  image: Image;

  @Prop({ trim: true, default: '' })
  description?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
