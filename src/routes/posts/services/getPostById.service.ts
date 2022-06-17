import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { PostDocument, Post } from 'src/schemas/post.schema';

export class GetPostByIdService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async getPById(id: string) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    return post;
  }
}
