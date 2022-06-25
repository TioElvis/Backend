import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RejectDto } from '../dto/reject.dto';

export class RejectService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async rejectFriendRequest(userId: string, rejectDto: RejectDto) {
    const { requestToReject } = rejectDto;

    if (userId === requestToReject) {
      throw new HttpException('You cant reject yourself', 400);
    }

    const user = await this.userSchema.findById(userId, {
      _id: true,
      friends: true,
      friendRequests: true,
    });

    const request = await this.userSchema.findById(requestToReject, {
      _id: true,
      friends: true,
      pendingFriendRequests: true,
    });

    if (!user || !user) {
      throw new HttpException('User not found', 404);
    }

    const theyAreFriends =
      user.friends.includes(request?._id) &&
      request.friends.includes(user?._id);

    if (theyAreFriends) {
      throw new HttpException('You cant reject a friend', 400);
    }

    const haveIFR =
      user.friendRequests.includes(request?._id) &&
      request.pendingFriendRequests.includes(user?._id);

    if (!haveIFR) {
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
