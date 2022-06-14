import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Post, PostDocument } from 'src/schemas/post.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  // Route find user
  async findUser(id: string) {
    const findUser = await this.userModel.findById(id);
    return findUser;
  }

  // Route posts friends
  async friendsPost(id: string) {
    const user = await this.userModel.findById(id, {
      friends: true,
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    console.log({ user });

    const usersIds: User[] = [user._id, ...user.friends];

    console.log(usersIds);

    const posts = await this.postModel.find({ userId: usersIds });

    console.log({ posts });

    return posts;
  }
}
