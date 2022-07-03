import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';

Injectable();
export class CancelService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async friendRequest(userId: string, userIdTo: string) {
    if (userId === userIdTo) {
      throw new HttpException(
        'You cannot cancel a friend request that you sent to yourself',
        400,
      );
    }

    const user = await this.userSchema
      .findById(userId, {
        _id: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    const request = await this.userSchema
      .findById(userIdTo, {
        _id: true,
        friendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!user || !request) {
      throw new HttpException('User not found', 404);
    }

    const iSendFriendRequest =
      user.pendingFriendRequests.includes(request?._id) &&
      request.friendRequests.includes(user?._id);

    if (!iSendFriendRequest) {
      throw new HttpException(
        'You cant cancel a friend request you never sent',
        400,
      );
    }

    try {
      await user?.updateOne({
        $pull: {
          pendingFriendRequests: request?._id,
        },
      });

      await request?.updateOne({
        $pull: {
          friendRequests: user?._id,
        },
      });

      return `You have canceled the friend request you sent to this user`;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
