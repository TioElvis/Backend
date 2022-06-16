import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

export class MyFriendsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Send friend Request
  async myF(id: string) {
    const user = await this.userModel
      .findById(id, {
        _id: false,
        friends: true,
      })
      .populate('friends');

    // If the user not exist
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const friends = user.friends;

    return friends;
  }
}
