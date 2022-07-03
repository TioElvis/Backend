import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';

@Injectable()
export class AcceptService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async friendRequest(userId: string, userIdTo: string) {
    if (userId === userIdTo) {
      throw new HttpException(
        'You cant accept a friend request that you sent to yourself',
        400,
      );
    }

    const user = await this.userSchema
      .findById(userId, {
        _id: true,
        friendRequests: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    const userToAccept = await this.userSchema
      .findById(userIdTo, {
        _id: true,
        friendRequests: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!user || !userToAccept) {
      throw new HttpException('User not found', 404);
    }

    const iHaveFriendRequest =
      user.friendRequests.includes(userToAccept?._id) &&
      userToAccept.pendingFriendRequests.includes(user?._id);

    if (!iHaveFriendRequest) {
      throw new HttpException('You have no friend request to accept', 400);
    }

    try {
      await user?.updateOne({
        $pull: {
          friendRequests: userToAccept?._id,
        },
        $push: {
          friends: userToAccept?._id,
        },
      });

      await userToAccept?.updateOne({
        $pull: {
          pendingFriendRequests: user?._id,
        },
        $push: {
          friends: user?._id,
        },
      });
      return `You and this user are friends`;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
