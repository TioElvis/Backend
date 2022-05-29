import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Users, UserDocument } from './schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UserDocument>,
  ) {}

  // Route find user
  async findUser(id: string) {
    const findUser = await this.userModel.findById(id);
    return findUser;
  }

  async friendsP(id: string) {
    const user = await this.userModel
      .findById(id, {
        _id: false,
        friends: true,
      })
      .populate({
        path: 'friends',
        select: { _id: true, posts: true },
        populate: { path: 'posts' },
      });

    return user.friends;
  }
}
