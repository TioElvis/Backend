import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CancelDto } from '../dto/cancel.dto';

export class CancelService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async cancelFriendRequest(userId: string, cancelFRDto: CancelDto) {
    const { requestToCancel } = cancelFRDto;

    if (userId === requestToCancel) {
      throw new HttpException('You cant cancel youself', 400);
    }

    const user = await this.userSchema.findById(userId, {
      _id: true,
      friends: true,
      pendingFriendRequests: true,
    });

    const request = await this.userSchema.findById(requestToCancel, {
      _id: true,
      friends: true,
      friendRequests: true,
    });

    if (!user || !request) {
      throw new HttpException('User not found', 404);
    }

    const sendIFR =
      user.pendingFriendRequests.includes(request?._id) &&
      request.friendRequests.includes(user?._id);

    if (!sendIFR) {
      throw new HttpException(
        'You cant cancel a friend request you never sent',
        400,
      );
    }

    const theyAreFriend =
      user.friends.includes(request?._id) &&
      request.friends.includes(user?._id);

    if (theyAreFriend) {
      throw new HttpException('This user is your friends', 400);
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
