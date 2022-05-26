import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { AcceptFRDto } from './dto/acceptFR.dto';
import { DeleteFDto } from './dto/deleteF.dto';
import { RejectFRDto } from './dto/rejectFR.dto';
import { SendFRDto } from './dto/sendFR.dto';
import { Model } from 'mongoose';
import { CancelFRDto } from './dto/cancelFR.dto';

@Injectable()
export class FriendsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Route Send Request Friend
  async sendRequest(id: string, sendFriendRequestDto: SendFRDto) {
    const { idUserToAdd } = sendFriendRequestDto;

    // If the user is sending a friend request to himself
    if (id === idUserToAdd) {
      throw new HttpException(
        'You cant send a friend request to yourself',
        401,
      );
    }

    // Extracting information from users
    const userSending = await this.userModel
      .findById(id, {
        _id: true,
        friends: true,
        friendsRequests: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const userReceiving = await this.userModel
      .findById(idUserToAdd, {
        _id: true,
        friends: true,
        friendsRequests: true,
        pendingFriendRequests: true,
        nickName: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const {
      friends: friendsUserSending,
      pendingFriendRequests: pFRUserSending,
      friendsRequests: fRUserSending,
    } = userSending;
    const {
      friends: friendsUserReceiving,
      friendsRequests: fRUserReceiving,
      pendingFriendRequests: pFRUserReceiving,
    } = userReceiving;

    // If they are already friends
    const isAlreadyAdded =
      friendsUserReceiving.includes(userSending?._id) &&
      friendsUserSending.includes(userReceiving?._id);

    if (isAlreadyAdded) {
      throw new HttpException('This user is already your friend', 401);
    }

    // If you already sent a friend request
    const friendRequestAlreadySent =
      fRUserReceiving.includes(userSending?._id) &&
      pFRUserSending.includes(userReceiving?._id);

    if (friendRequestAlreadySent) {
      throw new HttpException('You have already sent a friend request', 401);
    }

    // if the user who is receiving the friend request, already sent you a friend request
    const iHaveAlreadyFriendRequest =
      fRUserSending.includes(userReceiving?._id) &&
      pFRUserReceiving.includes(userSending?._id);

    if (iHaveAlreadyFriendRequest) {
      throw new HttpException(
        'This user is already sent you a friend request, you can accept their friend request',
        401,
      );
    }
    // Updating
    await userSending?.updateOne({
      $push: {
        pendingFriendRequests: userReceiving?._id,
      },
    });

    await userReceiving?.updateOne({
      $push: {
        friendsRequests: userSending?._id,
      },
    });

    return `You have sent a friend request to ${userReceiving.nickName}`;
  }

  // Route Accept Request Friend
  async acceptRequest(id: string, acceptRequestFriendDto: AcceptFRDto) {
    const { idUserToAccept } = acceptRequestFriendDto;

    // If the user wants to accept the same
    if (id === idUserToAccept) {
      throw new HttpException('You cant add yourself', 401);
    }

    // Extracting information from users
    const userAccepting = await this.userModel
      .findById(id, {
        _id: true,
        friendsRequests: true,
        friends: true,
        pendingFriendRequests: true,
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

    const {
      friends: friendsUserToAccept,
      pendingFriendRequests: pFRUserToAccept,
    } = userToAccept;
    const { friends: friendsUserAccepting, friendsRequests } = userAccepting;

    // If the user does not have any request from the user to accept
    const haveFriendRequest =
      pFRUserToAccept.includes(userAccepting?._id) &&
      friendsRequests.includes(userToAccept?._id);

    if (!haveFriendRequest) {
      throw new HttpException(
        'This user has not sent you a friend request',
        401,
      );
    }

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
  async rejectRequest(id: string, rejectRequestFriendDto: RejectFRDto) {
    const { idUserToRecject } = rejectRequestFriendDto;

    // If the user is sending a friend request to himself
    if (id === idUserToRecject) {
      throw new HttpException('You cant reject yourself', 401);
    }

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

    return `You have rejected a friend request from ${userToReject?.nickName} `;
  }

  // Route Delete Friend
  async deleteFriend(id: string, deleteFriendDto: DeleteFDto) {
    const { idFriendToDelete } = deleteFriendDto;

    // If the user is sending a friend request to himself
    if (id === idFriendToDelete) {
      throw new HttpException(
        'You cant remove yourself from your friends list',
        401,
      );
    }

    // Extracting information from users
    const userDeleting = await this.userModel
      .findById(id, {
        _id: true,
        friends: true,
        pendingFriendRequests: true,
        friendsRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const userToDelete = await this.userModel
      .findById(idFriendToDelete, {
        _id: true,
        friends: true,
        friendsRequests: true,
        pendingFriendRequests: true,
        nickName: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const {
      friends: friendsUserDeleting,
      pendingFriendRequests: pFRUserDeleting,
      friendsRequests: fRUserDeleting,
    } = userDeleting;

    const {
      friends: friendsUserToDelete,
      pendingFriendRequests: pFRUserToDelete,
      friendsRequests: fRUserToDelete,
    } = userToDelete;

    // If you have sent a friend request to the user to be deleted
    const youSendRFToThisUser =
      pFRUserDeleting.includes(userToDelete?._id) &&
      fRUserToDelete.includes(userDeleting?._id);

    if (youSendRFToThisUser) {
      throw new HttpException(
        'You have sent a friend request to this user so you cannot remove him from your friends list but you can cancel the friend request you have sent',
        401,
      );
    }

    // If the user to delete I send you a friend request
    const youHaveRFToThisUser =
      fRUserDeleting.includes(userToDelete?._id) &&
      pFRUserToDelete.includes(userDeleting?._id);

    if (youHaveRFToThisUser) {
      throw new HttpException(
        'This user has sent you a friend request, so you cannot remove him from your friends list, but you can reject the friend request he sent you',
        401,
      );
    }

    // If they are not friends
    const isFriend =
      friendsUserToDelete.includes(userDeleting?._id) &&
      friendsUserDeleting.includes(userToDelete?._id);

    if (!isFriend) {
      throw new HttpException(
        'This user is not your friend, therefore you cannot delete him',
        401,
      );
    }

    await userDeleting.updateOne({
      $pull: {
        friends: userToDelete?._id,
      },
    });

    await userToDelete.updateOne({
      $pull: {
        friends: userDeleting?._id,
      },
    });

    return `You have removed ${userToDelete?.nickName} from your friends list`;
  }

  cancelRequest(id: string, cancelFRdto: CancelFRDto) {
    return 'a';
  }
}
