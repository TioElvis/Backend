import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CancelFRDto } from '../dto/cancelFR.dto';

export class CancelFriendRequetService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Send friend Request
  async cancelFR(id: string, cancelFRDto: CancelFRDto) {
    const { idUserToCancel } = cancelFRDto;

    // If the user is cancelling himself
    if (id === idUserToCancel) {
      throw new HttpException('You cant cancel youself', 400);
    }

    // Extracting information from users
    const userCanceling = await this.userModel.findById(id, {
      _id: true,
      friends: true,
      pendingFriendRequests: true,
    });

    const userToCancel = await this.userModel.findById(idUserToCancel, {
      _id: true,
      nickname: true,
      friends: true,
      friendRequests: true,
    });

    // If the users not exist
    if (!userCanceling || !userToCancel) {
      throw new HttpException('User not found', 404);
    }

    // Destructuring information from users
    const { friends: fUserCanceling, pendingFriendRequests: pFRUserCanceling } =
      userCanceling;

    const { friends: fUserToCancel, friendRequests: fRUserToCancel } =
      userToCancel;

    // If you haven't snet any friend request
    const sendIFR =
      pFRUserCanceling.includes(userToCancel?._id) &&
      fRUserToCancel.includes(userCanceling?._id);

    if (!sendIFR) {
      throw new HttpException(
        'You cant cancel a friend request you never sent',
        400,
      );
    }

    // If they are friends
    const isAlreadyFriends =
      fUserCanceling.includes(userToCancel?._id) &&
      fUserToCancel.includes(userCanceling?._id);

    if (isAlreadyFriends) {
      throw new HttpException(
        'This user is your friends, therefore you cannot cancel the request friend',
        400,
      );
    }

    // Updating
    await userCanceling?.updateOne({
      $pull: {
        pendingFriendRequests: userToCancel?._id,
      },
    });

    await userToCancel?.updateOne({
      $pull: {
        friendRequests: userCanceling?._id,
      },
    });

    return `You have canceled the friend request you sent to ${userToCancel?.nickname}`;
  }
}
