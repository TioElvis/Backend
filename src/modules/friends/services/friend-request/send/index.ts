import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';

Injectable();
export class SendService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async friendRequest(userId: string, userIdTo: string) {
    if (userId === userIdTo) {
      throw new HttpException(
        'You cant send a friend request to yourself',
        400,
      );
    }

    const user = await this.userSchema
      .findById(userId, {
        friends: true,
        friendRequests: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    const request = await this.userSchema
      .findById(userIdTo, {
        friends: true,
        friendRequests: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!user || !request) {
      throw new HttpException('User not found', 404);
    }

    const theyAreFriends =
      user.friends.includes(request?._id) &&
      request.friends.includes(user?._id);

    if (theyAreFriends) {
      throw new HttpException('This user is already your friend', 400);
    }

    const iSentFriendRequest =
      user.pendingFriendRequests.includes(request?._id) &&
      request.friendRequests.includes(user?._id);

    if (iSentFriendRequest) {
      throw new HttpException('You have already sent a friend request', 400);
    }

    try {
      await user?.updateOne({
        $push: {
          pendingFriendRequests: request?._id,
        },
      });

      await request?.updateOne({
        $push: {
          friendRequests: user?._id,
        },
      });

      return `You have sent a friend request to this user`;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
