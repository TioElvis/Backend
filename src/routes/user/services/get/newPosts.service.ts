import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from 'src/schemas/post.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

export class NewPostsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async newPosts(id: string) {
    const user = await this.userModel.findById(id, {
      friends: true,
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const usersIds: User[] = [user._id, ...user.friends];

    const posts = await this.postModel
      .find({ userId: usersIds })
      .populate('userId', {
        nickname: 1,
        avatar: 1,
      })
      .sort({ createdAt: 'descending' });

    return posts;
  }
}
