import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { RejectFRDto } from '../dto/rejectFR.dto';

export class RejectFriendRequestService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Send friend Request
  async rejectFR(id: string, rejectFRDto: RejectFRDto) {
    const { idUserToRecject } = rejectFRDto;

    // If the user is rejecting himself
    if (id === idUserToRecject) {
      throw new HttpException('You cant reject yourself', 400);
    }

    // Extracting information form users
    const userRejecting = await this.userModel.findById(id, {
      _id: true,
      friends: true,
      friendRequests: true,
    });

    const userToReject = await this.userModel.findById(idUserToRecject, {
      _id: true,
      friends: true,
      nickname: true,
      pendingFriendRequests: true,
    });

    // If the users not exist
    if (!userRejecting || !userRejecting) {
      throw new HttpException('User not found', 404);
    }

    // Destructuring information from users
    const { friends: fUserRejecting, friendRequests: fRUserRejecting } =
      userRejecting;
    const { friends: fUserToReject, pendingFriendRequests: pFRUserToReject } =
      userToReject;

    // If they are already friends
    const areFriends =
      fUserRejecting.includes(userToReject?._id) &&
      fUserToReject.includes(userRejecting?._id);

    if (areFriends) {
      throw new HttpException('You cant reject a friend', 400);
    }

    // If it was already rejected or never i send you a friend request
    const haveIFR =
      fRUserRejecting.includes(userToReject?._id) &&
      pFRUserToReject.includes(userRejecting?._id);

    if (!haveIFR) {
      throw new HttpException('This user never sent you a request', 400);
    }

    // Updating
    await userRejecting?.updateOne({
      $pull: {
        friendRequests: userToReject?._id,
      },
    });

    await userToReject?.updateOne({
      $pull: {
        pendingFriendRequests: userRejecting?._id,
      },
    });

    return `You have rejected a friend request from ${userToReject?.nickname} `;
  }
}
