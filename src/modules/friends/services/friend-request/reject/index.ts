import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';

Injectable();
export class RejectService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async friendRequest(userId: string, userIdTo: string) {
    if (userId === userIdTo) {
      throw new HttpException(
        'You cannot decline a friend request that you sent to yourself.',
        400,
      );
    }

    const user = await this.userSchema
      .findById(userId, {
        _id: true,
        friendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    const request = await this.userSchema
      .findById(userIdTo, {
        _id: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!user || !request) {
      throw new HttpException('User not found', 404);
    }

    const iHaveFriendRequest =
      user.friendRequests.includes(request?._id) &&
      request.pendingFriendRequests.includes(user?._id);

    if (!iHaveFriendRequest) {
      throw new HttpException('This user never sent you a request', 400);
    }

    try {
      await user?.updateOne({
        $pull: {
          friendRequests: request?._id,
        },
      });

      await request?.updateOne({
        $pull: {
          pendingFriendRequests: user?._id,
        },
      });

      return `You have rejected a friend request`;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
