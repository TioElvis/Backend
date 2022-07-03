import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';

@Injectable()
export class IHaveService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async friendRequest(userId: string, userIdToCompare: string) {
    const user = await this.userSchema
      .findById(userId, {
        _id: true,
        friendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    const userToCompare = await this.userSchema
      .findById(userIdToCompare, {
        _id: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!user || !userToCompare) {
      throw new HttpException('User not found', 404);
    }

    const iHaveFriendRequest =
      user.friendRequests.includes(userToCompare?._id) &&
      userToCompare.pendingFriendRequests.includes(user?._id);

    try {
      return iHaveFriendRequest;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
