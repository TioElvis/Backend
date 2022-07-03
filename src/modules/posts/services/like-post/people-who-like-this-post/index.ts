import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from 'src/schemas/post-schema';

@Injectable()
export class GetPeopleWhoLikeThisService {
  constructor(
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
  ) {}

  async post(postId: string) {
    const post = await this.postSchema
      .findById(postId, { _id: false, likes: true })
      .populate('likes', {
        avatar: 1,
        nickname: 1,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    try {
      return post.likes;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
