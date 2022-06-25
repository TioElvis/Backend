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

    const user = await this.userModel.findById(id, {
      _id: true,
      avatar: true,
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (!file) {
      throw new HttpException('Add an image to update the avatar', 400);
    }

    try {
      if (file) {
        const result = await uploadImage(file.path);
        avatar = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        await remove(file.path);
      }

      await user?.updateOne({
        $set: {
          avatar: avatar,
        },
      });
      return `You have update an avatar successfully`;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
