import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, User } from 'src/schemas/user.schema';
import { AcceptFRDto } from './dto/acceptFR.dto';
import { CancelFRDto } from './dto/cancelFR.dto';
import { DeleteFDto } from './dto/deleteF.dto';
import { RejectFRDto } from './dto/rejectFR.dto';
import { SendFRDto } from './dto/sendFR.dto';

@Injectable()
export class FriendsService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Route send friend request
  async sendFR(id: string, sendFRDto: SendFRDto) {
    const { idUserToAdd } = sendFRDto;

    // If the user is sending the friend request to himself
    if (id === idUserToAdd) {
      throw new HttpException('You cant send a friend request to yoursel', 400);
    }

    // Extracting information from users
    const userSending = await this.userModel
      .findById(id, {
        _id: true,
        friends: true,
        friendRequests: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 400);
      });

    const userToAdd = await this.userModel
      .findById(idUserToAdd, {
        _id: true,
        nickName: true,
        friends: true,
        friendRequests: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 400);
      });

    // If the id has the same characters as the normal id but does not exist
    if (!userSending || !userToAdd) {
      throw new HttpException('User not found', 404);
    }

    // Destructuring information from users
    const {
      friends: fUserSending,
      pendingFriendRequests: pFRUserSending,
      friendRequests: fRUserSending,
    } = userSending;

    const {
      friends: fUserToAdd,
      friendRequests: fRUserToAdd,
      pendingFriendRequests: pFRUserToAdd,
    } = userToAdd;

    // If they are already friends
    const isAlreadyF =
      fUserSending.includes(userToAdd?._id) &&
      fUserToAdd.includes(userSending?._id);

    if (isAlreadyF) {
      throw new HttpException('This user is already your friend', 400);
    }

    // If you already sent a friend request
    const fRAlreadySent =
      pFRUserSending.includes(userToAdd?._id) &&
      fRUserToAdd.includes(userSending?._id);

    if (fRAlreadySent) {
      throw new HttpException('You have already sent a friend request', 400);
    }

    // if the user who is receiving the friend request, already sent you a friend request
    const iHaveFR =
      fRUserSending.includes(userToAdd?._id) &&
      pFRUserToAdd.includes(userSending?._id);

    if (iHaveFR) {
      throw new HttpException('This user sent you a friend request', 400);
    }

    await userSending?.updateOne({
      $push: {
        pendingFriendRequests: userToAdd?._id,
      },
    });

    await userToAdd?.updateOne({
      $push: {
        friendRequests: userSending?._id,
      },
    });

    return `You have sent a friend request to ${userToAdd.nickName}`;
  }

  // Route accept friend request
  async acceptFR(id: string, acceptFRDto: AcceptFRDto) {
    const { idUserToAccept } = acceptFRDto;

    // If the user wants to accept to himself
    if (id === idUserToAccept) {
      throw new HttpException('You cant accept yourself', 400);
    }

    // Extracting information from the users
    const userAccepting = await this.userModel
      .findById(id, {
        _id: true,
        friendRequests: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 400);
      });

    const userToAccept = await this.userModel
      .findById(idUserToAccept, {
        _id: true,
        nickName: true,
        friendRequests: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 400);
      });

    // If the id has the same characters as the normal id but does not exist
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

    return `You and ${userToAccept?.nickName} are friends`;
  }

  // Route reject friend request
  async rejectFR(id: string, rejectFRDto: RejectFRDto) {
    const { idUserToRecject } = rejectFRDto;

    // If the user is rejecting himself
    if (id === idUserToRecject) {
      throw new HttpException('You cant reject yourself', 400);
    }

    // Extracting information form users
    const userRejecting = await this.userModel
      .findById(id, {
        _id: true,
        friends: true,
        friendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const userToReject = await this.userModel
      .findById(idUserToRecject, {
        _id: true,
        friends: true,
        nickName: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    // If the id has the same characters as the normal id per does not exist
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

    return `You have rejected a friend request from ${userToReject?.nickName} `;
  }

  // Route cancel friend request
  async cancelFR(id: string, cancelFRdto: CancelFRDto) {
    const { idUserToCancel } = cancelFRdto;

    // If the user is cancelling himself
    if (id === idUserToCancel) {
      throw new HttpException('You cant cancel youself', 400);
    }

    // Extracting information from users
    const userCanceling = await this.userModel
      .findById(id, {
        _id: true,
        friends: true,
        pendingFriendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const userToCancel = await this.userModel
      .findById(idUserToCancel, {
        _id: true,
        friends: true,
        friendRequests: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    // If the id has the same characters as the normal id per does not exist
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

    return `You have canceled the friend request you sent to ${userCanceling?.nickName}`;
  }

  // Route delete friend
  async deleteF(id: string, deleteFriendDto: DeleteFDto) {
    const { idFriendToDelete } = deleteFriendDto;

    // If the user is deleting himself
    if (id === idFriendToDelete) {
      throw new HttpException(
        'You cant remove yourself from your friends list',
        400,
      );
    }

    // Extracting information from users
    const userDeleting = await this.userModel
      .findById(id, {
        _id: true,
        friends: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    const userToDelete = await this.userModel
      .findById(idFriendToDelete, {
        _id: true,
        friends: true,
        nickName: true,
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    // if the id has the same characters as the normal id per does not exist
    if (!userDeleting || !userToDelete) {
      throw new HttpException('User not found', 404);
    }

    // Destructuring information from users
    const { friends: fUserDeleting } = userDeleting;

    const { friends: fUserToDelete } = userToDelete;

    // If they are not friends
    const areFriend =
      fUserDeleting.includes(userToDelete?._id) &&
      fUserToDelete.includes(userDeleting?._id);

    if (!areFriend) {
      throw new HttpException('This user is not your friend', 400);
    }

    // Updating
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
}
