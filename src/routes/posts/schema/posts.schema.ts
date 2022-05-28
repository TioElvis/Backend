import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true, ref: 'users' })
  userId: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  image?: {
    url: string;
    public_id: string;
  };

  @Prop({ trim: true, default: '' })
  description?: string;

  @Prop({ ref: 'comments', default: [] })
  comment: Types.ObjectId[];

  @Prop({ default: [] })
  likes: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
