import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { PostDocument, Post } from 'src/schemas/post.schema';

export class DisLikeThatPostService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async dislikeThatP(userId: string, postId: string) {
    const user = await this.userModel.findById(userId, {
      postsThatIlike: true,
    });

    const post = await this.postModel.findById(postId, {
      _id: true,
      likes: true,
    });

    if (!user || !post) {
      throw new HttpException('User or post not found', 404);
    }

    const removeLike = post.likes - 1;

    const { postsThatIlike } = user;

    const IAlreadyLikedIt = postsThatIlike.includes(post?._id);

    if (!IAlreadyLikedIt) {
      throw new HttpException('You already disliked this post', 400);
    }

    await user?.updateOne({
      $pull: {
        postsThatIlike: post?._id,
      },
    });

    await post?.updateOne({
      $set: {
        likes: removeLike,
      },
    });

    return 'You disliked this post';
  }
}
