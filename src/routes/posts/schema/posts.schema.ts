import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Users } from 'src/routes/users/schema/users.schema';

export type PostDocument = Posts & mongoose.Document;

@Schema()
export class Posts {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
    default: '',
  })
  userId: Users;

  @Prop({ type: Object, default: {} })
  image?: {
    url: string;
    public_id: string;
  };

  @Prop({ trim: true, default: '' })
  description?: string;
}

export const PostSchema = SchemaFactory.createForClass(Posts);
