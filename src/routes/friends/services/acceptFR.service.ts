import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { AcceptFRDto } from '../dto/acceptFR.dto';

export class AcceptFriendRequestService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Send friend Request
  async acceptFR(id: string, acceptFRDto: AcceptFRDto) {
    const { idUserToAccept } = acceptFRDto;

    // If the user wants to accept to himself
    if (id === idUserToAccept) {
      throw new HttpException('You cant accept yourself', 400);
    }

    // Extracting information from the users
    const userAccepting = await this.userModel.findById(id, {
      _id: true,
      friendRequests: true,
      pendingFriendRequests: true,
    });

    const userToAccept = await this.userModel.findById(idUserToAccept, {
      _id: true,
      nickname: true,
      friendRequests: true,
      pendingFriendRequests: true,
    });

    // If the users not exist
    if (!userAccepting || !userToAccept) {
      throw new HttpException('User not found', 404);
    }

    // Destructuring information from usersà
    const { friendRequests: fRUserAccepting } = userAccepting;

    const { pendingFriendRequests: pFRUserToAccept } = userToAccept;

    // If the user does not have any request from the user to accept
    const haveIFR =
      fRUserAccepting.includes(userToAccept?._id) &&
      pFRUserToAccept.includes(userAccepting?._id);

    if (!haveIFR) {
      throw new HttpException(
        'This user has not sent you a friend request',
        400,
      );
    }

    // Updating
    await userAccepting?.updateOne({
      $pull: {
        friendRequests: userToAccept?._id,
      },
      $push: {
        friends: userToAccept?._id,
      },
    });

    await userToAccept?.updateOne({
      $pull: {
        pendingFriendRequests: userAccepting?._id,
      },
      $push: {
        friends: userAccepting?._id,
      },
    });

    return `You and ${userToAccept?.nickname} are friends`;
  }
}
