import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from 'src/schemas/post.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

export class GiveLikeService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
  ) {}

  async giveLike(userId: string, postId: string) {
    const user = await this.userSchema.findById(userId, {
      postsLikes: true,
    });

    const post = await this.postSchema.findById(postId, {
      isLikes: true,
      likes: true,
    });

    if (!user || !post) {
      new HttpException('User or post not found', 404);
    }

    if (!post.isLikes) {
      throw new HttpException('You cant like this post', 400);
    }

    const isLiked =
      user.postsLikes.includes(post?._id) && post.likes.includes(user?._id);

    if (isLiked) {
      throw new HttpException('You has liked this post', 400);
    }

    try {
      await user.updateOne({
        $push: {
          postsLikes: post?._id,
        },
      });

      await post?.updateOne({
        $push: {
          likes: user?._id,
        },
      });

      return {
        isLiked: true,
        likes: post.likes.length,
      };
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
