import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { AcceptRequestFriendDto } from './dto/acceptRequestFriendDto.dto';
import { RejectRequestFriendDto } from './dto/rejectRequestFriendDto.dto';
import { SendRequestFriendDto } from './dto/sendRequestFriendDto.dto';

@Injectable()
export class FriendsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Route Send Request Friend
  async sendRequest(id: string, sendRequestFriendDto: SendRequestFriendDto) {
    const { idUserToAdd } = sendRequestFriendDto;

    // If the user is sending a request to himself
    if (id === idUserToAdd) {
      throw new HttpException('You cant add yourself', 401);
    }

    // Extracting information from users
    const userSendingFriendRequest = await this.userModel
      .findById(id, {
        _id: true,
        friends: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const userReceivingFriendRequest = await this.userModel
      .findById(idUserToAdd, {
        _id: true,
        friends: true,
        friendsRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const { friends: friendsUserSending, pendingFriendRequests } =
      userSendingFriendRequest;
    const { friends: friendsUserReceiving, friendsRequests } =
      userReceivingFriendRequest;

    // If they are already friends
    const isAlreadyAdded =
      friendsUserReceiving.includes(userSendingFriendRequest?._id) &&
      friendsUserSending.includes(userReceivingFriendRequest?._id);

    if (isAlreadyAdded) {
      throw new HttpException('This user is already your friend', 401);
    }

    // If you have already submitted an application
    const requestAlreadySent =
      friendsRequests.includes(userSendingFriendRequest?._id) &&
      pendingFriendRequests.includes(userReceivingFriendRequest?._id);

    if (requestAlreadySent) {
      throw new HttpException('You have already sent a friend request', 401);
    }

    // Updating
    await userSendingFriendRequest?.updateOne({
      $push: {
        pendingFriendRequests: userReceivingFriendRequest?._id,
      },
    });

    await userReceivingFriendRequest?.updateOne({
      $push: {
        friendsRequests: userSendingFriendRequest?._id,
      },
    });

    return 'The request has been sent successfully';
  }

  // Route Accept Request Friend
  async acceptRequest(
    id: string,
    acceptRequestFriendDto: AcceptRequestFriendDto,
  ) {
    const { idUserToAccept } = acceptRequestFriendDto;

    // Extracting information from users
    const userAccepting = await this.userModel
      .findById(id, {
        _id: true,
        friendsRequests: true,
        friends: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const userToAccept = await this.userModel
      .findById(idUserToAccept, {
        _id: true,
        pendingFriendRequests: true,
        friends: true,
        nickName: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const { friends: friendsUserToAccept } = userToAccept;
    const { friends: friendsUserAccepting } = userAccepting;

    // If they are already friends
    const isAlreadyAdded =
      friendsUserToAccept.includes(userAccepting?._id) &&
      friendsUserAccepting.includes(userToAccept?._id);

    if (isAlreadyAdded) {
      throw new HttpException('This user is already your friend', 401);
    }

    // Updating
    await userAccepting?.updateOne({
      $pull: {
        friendsRequests: userToAccept?._id,
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

    return `You and ${userToAccept?.nickName} are friends`;
  }

  // Route Reject Request Friend
  async rejectRequest(
    id: string,
    rejectRequestFriendDto: RejectRequestFriendDto,
  ) {
    const { idUserToRecject } = rejectRequestFriendDto;

    // Extracting information from users
    const userRejecting = await this.userModel
      .findById(id, {
        _id: true,
        friendsRequests: true,
        friends: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const userToReject = await this.userModel
      .findById(idUserToRecject, {
        _id: true,
        pendingFriendRequests: true,
        friends: true,
        nickName: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const { friends: friendsUserReject, pendingFriendRequests } = userToReject;
    const { friends: friendsUserRejecting, friendsRequests } = userRejecting;

    // If they are already friends
    const isFriend =
      friendsUserReject.includes(userRejecting?._id) &&
      friendsUserRejecting.includes(userToReject?._id);

    if (isFriend) {
      throw new HttpException(
        'You cant reject a friend but you can remove them from your friends list',
        401,
      );
    }

    const isAlreadyReject =
      pendingFriendRequests.includes(userRejecting?._id) &&
      friendsRequests.includes(userToReject?._id);

    if (!isAlreadyReject) {
      throw new HttpException(
        'This user has already been rejected or never sent you a request',
        401,
      );
    }

    // Updating
    await userRejecting?.updateOne({
      $pull: {
        friendsRequests: userToReject?._id,
      },
    });

    await userToReject?.updateOne({
      $pull: {
        pendingFriendRequests: userRejecting?._id,
      },
    });

    return `you removed ${userToReject.nickName} from your friends list `;
  }
}
