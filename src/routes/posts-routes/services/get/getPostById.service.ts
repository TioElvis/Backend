import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from 'src/schemas/post.schema';

export class GetPostByIdService {
  constructor(
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
  ) {}

  async getById(userId: string) {
    const post = await this.postSchema
      .findById(userId, {
        likes: false,
      })
      .populate('userId', {
        nickname: 1,
        avatar: 1,
      });

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    return post;
  }
}
