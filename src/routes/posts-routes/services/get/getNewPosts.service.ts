import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { PostDocument, Post } from 'src/schemas/post.schema';

export class GetNewPostsService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
  ) {}

  async getNew(userId: string) {
    const user = await this.userSchema.findById(userId, {
      friends: true,
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const usersIds: User[] = [user._id, ...user.friends];

    const posts = await this.postSchema
      .find({ userId: usersIds })
      .populate('userId', {
        nickname: 1,
        avatar: 1,
      })
      .sort({ createdAt: 'descending' });

    return posts;
  }
}
