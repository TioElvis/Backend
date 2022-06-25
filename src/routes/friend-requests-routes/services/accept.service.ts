import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { AcceptDto } from '../dto/accept.dto';

export class AcceptService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async acceptFriendRequest(userId: string, acceptDto: AcceptDto) {
    const { requestToAccept } = acceptDto;

    if (userId === requestToAccept) {
      throw new HttpException('You cant accept yourself', 400);
    }

    const user = await this.userSchema.findById(userId, {
      _id: true,
      friendRequests: true,
      pendingFriendRequests: true,
    });

    const userToAccept = await this.userSchema.findById(requestToAccept, {
      _id: true,
      friendRequests: true,
      pendingFriendRequests: true,
    });

    if (!user || !userToAccept) {
      throw new HttpException('User not found', 404);
    }

    const iHaveFR =
      user.friendRequests.includes(userToAccept?._id) &&
      userToAccept.pendingFriendRequests.includes(user?._id);

    if (!iHaveFR) {
      throw new HttpException(
        'This user has not sent you a friend request',
        400,
      );
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
