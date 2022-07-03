import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';
import { PostDocument, Post } from 'src/schemas/post-schema';

@Injectable()
export class ILikeThatService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async post(userId: string, postId: string) {
    const user = await this.userModel
      .findById(userId, {
        postsLikes: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    const post = await this.postModel
      .findById(postId, {
        likes: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!user || !post) {
      throw new HttpException('User or post not found', 404);
    }

    const like =
      user.postsLikes.includes(post?._id) && post.likes.includes(user?._id);

    try {
      return { like: like, likes: post.likes.length };
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
