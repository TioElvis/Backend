import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

export class GetUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(id: string) {
    const user = await this.userModel.findById(id);

    // If the user not exist
    if (!user) {
      throw new HttpException('User not found', 40);
    }

    return user;
  }
}
