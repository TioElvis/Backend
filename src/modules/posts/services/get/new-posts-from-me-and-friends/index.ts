import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';
import { PostDocument, Post } from 'src/schemas/post-schema';

@Injectable()
export class NewFromMeAndFriendsService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
  ) {}

  async posts(userId: string) {
    const user = await this.userSchema
      .findById(userId, {
        friends: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
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
      .sort({ createdAt: 'descending' })
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
