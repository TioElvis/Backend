import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, Post } from 'src/schemas/post.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

export class LikeThatPostService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async likeThatP(userId: string, postId: string) {
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

    const addLike = post.likes + 1;

    const { postsThatIlike } = user;

    const IAlreadyLikedIt = postsThatIlike.includes(post?._id);

    if (IAlreadyLikedIt) {
      throw new HttpException('You already liked this post', 400);
    }

    await user?.updateOne({
      $push: {
        postsThatIlike: post?._id,
      },
    });

    await post?.updateOne({
      $set: {
        likes: addLike,
      },
    });

    return 'You liked this post';
  }
}
