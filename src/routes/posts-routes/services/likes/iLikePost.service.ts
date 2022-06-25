import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { PostDocument, Post } from 'src/schemas/post.schema';

export class ILikePostService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async iLike(userId: string, postId: string) {
    const user = await this.userModel.findById(userId, {
      postsLikes: true,
    });

    const post = await this.postModel.findById(postId, {
      likes: true,
    });

    if (!user || !post) {
      throw new HttpException('User or post not found', 404);
    }

    const isLiked =
      user.postsLikes.includes(post?._id) && post.likes.includes(user?._id);

    return { isLiked, likes: post.likes.length };
  }
}
