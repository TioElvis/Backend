import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { DeleteFDto } from '../dto/deleteF.dto';

export class DeleteFriendService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Send friend Request
  async deleteF(id: string, deleteFDto: DeleteFDto) {
    const { idFriendToDelete } = deleteFDto;

    // If the user is deleting himself
    if (id === idFriendToDelete) {
      throw new HttpException(
        'You cant remove yourself from your friends list',
        400,
      );
    }

    // Extracting information from users
    const userDeleting = await this.userModel.findById(id, {
      _id: true,
      friends: true,
    });

    const userToDelete = await this.userModel.findById(idFriendToDelete, {
      _id: true,
      friends: true,
      nickname: true,
    });

    // if the users not exist
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

    return `You have removed ${userToDelete?.nickname} from your friends list`;
  }
}
