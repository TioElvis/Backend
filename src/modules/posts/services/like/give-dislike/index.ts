import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';
import { PostDocument, Post } from 'src/schemas/post-schema';

@Injectable()
export class GiveDislikeService {
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
        isLikes: true,
        likes: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!user || !post) {
      new HttpException('User or post not found', 404);
    }

    if (!post.isLikes) {
      throw new HttpException('You cant like this post', 400);
    }

    const like = user.postsLikes.includes(post?._id);

    if (!like) {
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
        like: false,
        likes: post.likes.length,
      };
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
