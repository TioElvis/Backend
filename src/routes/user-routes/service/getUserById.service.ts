import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

export class GetUserByIdService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async getById(userId: string) {
    const user = await this.userSchema.findById(userId);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    try {
      return user;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
