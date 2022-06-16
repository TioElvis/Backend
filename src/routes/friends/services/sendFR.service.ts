import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { SendFRDto } from '../dto/sendFR.dto';

export class SendFriendRequestService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async sendFR(id: string, sendFRDto: SendFRDto) {
    const { idUserToAdd } = sendFRDto;

    // If the user is sending the friend request to himself
    if (id === idUserToAdd) {
      throw new HttpException('You cant send a friend request to yoursel', 400);
    }

    // Extracting information from users
    const userSendingFR = await this.userModel.findById(id, {
      friends: true,
      friendRequests: true,
      pendingFriendRequests: true,
    });

    const userToAdd = await this.userModel.findById(idUserToAdd, {
      _id: true,
      nickname: true,
      friends: true,
      friendRequests: true,
      pendingFriendRequests: true,
    });

    // If the users not exist
    if (!userSendingFR || !userToAdd) {
      throw new HttpException('User not found', 404);
    }

    // Destructuring information from users
    const {
      friends: fUserSendingFR,
      pendingFriendRequests: pFRUserSendingFR,
      friendRequests: fRUserSendingFR,
    } = userSendingFR;

    const {
      friends: fUserToAdd,
      friendRequests: fRUserToAdd,
      pendingFriendRequests: pFRUserToAdd,
    } = userToAdd;

    // If they are already friends
    const isAlreadyF =
      fUserSendingFR.includes(userToAdd?._id) &&
      fUserToAdd.includes(userSendingFR?._id);

    if (isAlreadyF) {
      throw new HttpException('This user is already your friend', 400);
    }

    // If you already sent a friend request
    const fRAlreadySent =
      pFRUserSendingFR.includes(userToAdd?._id) &&
      fRUserToAdd.includes(userSendingFR?._id);

    if (fRAlreadySent) {
      throw new HttpException('You have already sent a friend request', 400);
    }

    // if the user who is receiving the friend request, already sent you a friend request
    const iHaveFR =
      fRUserSendingFR.includes(userToAdd?._id) &&
      pFRUserToAdd.includes(userSendingFR?._id);

    if (iHaveFR) {
      throw new HttpException('This user sent you a friend request', 400);
    }

    await userSendingFR?.updateOne({
      $push: {
        pendingFriendRequests: userToAdd?._id,
      },
    });

    await userToAdd?.updateOne({
      $push: {
        friendRequests: userSendingFR?._id,
      },
    });

    return `You have sent a friend request to ${userToAdd.nickname}`;
  }
}
