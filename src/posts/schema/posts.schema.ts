import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop()
  userId: string;

  @Prop({ type: Object })
  image?: {
    url: string;
    public_id: string;
  };

  @Prop({ trim: true })
  description?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
