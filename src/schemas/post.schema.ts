import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type PostDocument = Post & Document;

type Image = {
  url?: string;
  public_id?: string;
};

@Schema({ timestamps: true })
export class Post {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
  })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: Object, default: {} })
  image: Image;

  @Prop({ trim: true, default: '' })
  description?: string;

  @Prop({ type: Boolean, default: true })
  isComment: boolean;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    default: [],
  })
  comment: Array<mongoose.Types.ObjectId | Comment>;

  @Prop({ type: Boolean, default: true })
  isLikes: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
