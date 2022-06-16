import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { remove } from 'fs-extra';
import { Model } from 'mongoose';
import { uploadImage } from 'src/libs/cloudinary';
import { Avatar, User, UserDocument } from 'src/schemas/user.schema';

export class UpdateAvatarService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateAvatar(id: string, file: Express.Multer.File) {
    let avatar: Avatar;

    // Extracting user information
    const userUpdatingAvatar = await this.userModel.findById(id, {
      _id: true,
      nickname: true,
      avatar: true,
    });

    // If the user no exist
    if (!userUpdatingAvatar) {
      throw new HttpException('User not found', 404);
    }

    // If there is no image or description
    if (!file) {
      throw new HttpException('Add an image to update the avatar', 400);
    }

    if (file) {
      const result = await uploadImage(file.path);
      avatar = {
        url: result.secure_url,
        public_id: result.public_id,
      };
      await remove(file.path);
    }

    // updating
    await userUpdatingAvatar?.updateOne({
      $set: {
        avatar: avatar,
      },
    });

    return `${userUpdatingAvatar?.nickname} you have update an avatar successfully`;
  }
}
