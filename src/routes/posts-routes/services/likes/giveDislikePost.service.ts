import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { PostDocument, Post } from 'src/schemas/post.schema';

export class GiveDislikeService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async giveDislike(userId: string, postId: string) {
    const user = await this.userModel.findById(userId, {
      postsLikes: true,
    });

    const post = await this.postModel.findById(postId, {
      isLikes: true,
      likes: true,
    });

    if (!user || !post) {
      new HttpException('User or post not found', 404);
    }

    if (!post.isLikes) {
      throw new HttpException('You cant like this post', 400);
    }

    const isLiked = user.postsLikes.includes(post?._id);

    if (!isLiked) {
      throw new HttpException(`You hasn't liked this post`, 400);
    }

    try {
      await user.updateOne({
        $pull: {
          postsLikes: post?._id,
        },
      });

      await post?.updateOne({
        $pull: {
          likes: user?._id,
        },
      });

      return {
        isLiked: false,
        likes: post.likes.length,
      };
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
