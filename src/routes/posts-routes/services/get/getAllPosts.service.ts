import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from 'src/schemas/post.schema';

export class GetAllPostsService {
  constructor(
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
  ) {}

  async getAll() {
    const posts = await this.postSchema.find();
    return posts;
  }
}
