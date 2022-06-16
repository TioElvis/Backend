import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { IsMyFriendDto } from '../dto/isMyF.dto';

export class IsMyFriendService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Send friend Request
  async isMyF(id: string, isMyFriendDto: IsMyFriendDto): Promise<boolean> {
    const { idIsMyFriendDto } = isMyFriendDto;

    const user = await this.userModel.findById(id, {
      _id: true,
      friends: true,
    });

    const isMyFriend = await this.userModel.findById(idIsMyFriendDto, {
      _id: true,
      friends: true,
    });

    // If the users not exist
    if (!user || !isMyFriend) {
      throw new HttpException('User not found', 404);
    }

    // Destructuring information from users
    const { friends: fUser } = user;
    const { friends: fisMyFriend } = isMyFriend;

    const areFriend =
      fUser.includes(isMyFriend?._id) && fisMyFriend.includes(user?._id);

    return areFriend;
  }
}
