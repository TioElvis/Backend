import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from 'src/schemas/post-schema';

Injectable();
export class GetAllPService {
  constructor(
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
  ) {}

  async posts() {
    const posts = await this.postSchema
      .find()
      .populate('userId', {
        avatar: 1,
        nickname: 1,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    try {
      return posts;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
