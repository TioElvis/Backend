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

  // Route Send Friend Request
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
        throw new HttpException('User to send friend request not found', 404);
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
        throw new HttpException(
          'User to receive friend request not found',
          404,
        );
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
      throw new HttpException('This user is already your friend', 400);
    }

    // If you already sent a friend request
    const friendRequestAlreadySent =
      fRUserReceiving.includes(userSending?._id) &&
      pFRUserSending.includes(userReceiving?._id);

    if (friendRequestAlreadySent) {
      throw new HttpException('You have already sent a friend request', 400);
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
      throw new HttpException('You cant add yourself', 400);
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
        throw new HttpException('User accepting friend request not found', 404);
      });

    const userToAccept = await this.userModel
      .findById(idUserToAccept, {
        _id: true,
        pendingFriendRequests: true,
        friends: true,
        nickName: true,
      })
      .catch(() => {
        throw new HttpException('User to accept friend request not found', 404);
      });

    const {
      friends: friendsUserToAccept,
      pendingFriendRequests: pFRUserToAccept,
    } = userToAccept;
    const { friends: friendsUserAccepting, friendsRequests } = userAccepting;

    // If the user does not have any request from the user to accept
    const iHaveFR =
      pFRUserToAccept.includes(userAccepting?._id) &&
      friendsRequests.includes(userToAccept?._id);

    if (!iHaveFR) {
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
      throw new HttpException('This user is already your friend', 400);
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

  // Route Reject Friend Request
  async rejectRequest(id: string, rejectRequestFriendDto: RejectFRDto) {
    const { idUserToRecject } = rejectRequestFriendDto;

    // If the user is rejecting himself
    if (id === idUserToRecject) {
      throw new HttpException('You cant reject yourself', 400);
    }

    // Extracting information from users
    const userRejecting = await this.userModel
      .findById(id, {
        _id: true,
        friendsRequests: true,
        friends: true,
      })
      .catch(() => {
        throw new HttpException('User to reject friend request not found', 404);
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

    // If it was already rejected or never I send you a friend request
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

    // If the user is deleting himself
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
        throw new HttpException('User removing friend not found', 404);
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
        throw new HttpException('User to delete not found', 404);
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
    const iSendRFToThisUser =
      pFRUserDeleting.includes(userToDelete?._id) &&
      fRUserToDelete.includes(userDeleting?._id);

    if (iSendRFToThisUser) {
      throw new HttpException(
        'You have sent a friend request to this user so you cannot remove him from your friends list but you can cancel the friend request you have sent',
        401,
      );
    }

    // If the user to delete I send you a friend request
    const iHaveRFToThisUser =
      fRUserDeleting.includes(userToDelete?._id) &&
      pFRUserToDelete.includes(userDeleting?._id);

    if (iHaveRFToThisUser) {
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
      throw new HttpException('This user is not your friend', 400);
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

  // Route Cancel Friend Request
  async cancelRequest(id: string, cancelFRdto: CancelFRDto) {
    const { idUserToCancel } = cancelFRdto;

    // If the user is canceling himself

    if (id === idUserToCancel) {
      throw new HttpException('You cant cancel a friend request yourself', 400);
    }

    // Extracting information from users
    const userCanceling = await this.userModel
      .findById(id, {
        _id: true,
        friends: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User canceling friend request not found', 404);
      });

    const userToCancel = await this.userModel
      .findById(idUserToCancel, {
        _id: true,
        friends: true,
        friendsRequests: true,
        nickName: true,
      })
      .catch(() => {
        throw new HttpException('User to cancel friend request not found', 404);
      });

    const {
      friends: friendsUserCanceling,
      pendingFriendRequests: pFRUserCaceling,
    } = userCanceling;
    const { friends: friendsUserToCanceled, friendsRequests: fRUserToCancel } =
      userToCancel;

    // If you haven't sent any friend requests
    const iSendFR =
      pFRUserCaceling.includes(userToCancel?._id) &&
      fRUserToCancel.includes(userCanceling?._id);

    if (!iSendFR) {
      throw new HttpException(
        'You cant cancel a friend request you never sent',
        400,
      );
    }

    // If They are friends
    const isAlreadyFriends =
      friendsUserCanceling.includes(userToCancel?._id) &&
      friendsUserToCanceled.includes(userCanceling?._id);

    if (isAlreadyFriends) {
      throw new HttpException(
        'This user is your friend, therefore you cannot cancel the friend request but you can remove him as a friend',
        400,
      );
    }

    await userCanceling?.updateOne({
      $pull: {
        pendingFriendRequests: userToCancel?._id,
      },
    });

    await userToCancel?.updateOne({
      $pull: {
        friendsRequests: userCanceling?._id,
      },
    });

    return `You have canceled the request you sent to ${userToCancel?.nickName}`;
  }
}
