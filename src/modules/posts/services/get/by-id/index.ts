import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from 'src/schemas/post-schema';

@Injectable()
export class ByIdService {
  constructor(
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
  ) {}

  async post(userId: string) {
    const post = await this.postSchema
      .findById(userId, {
        likes: false,
      })
      .populate('userId', {
        nickname: 1,
        avatar: 1,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    try {
      return post;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
