import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';

Injectable();
export class isMyService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async friend(userId: string, userIdToCompare: string) {
    const user = await this.userSchema.findById(userId, {
      _id: true,
      friends: true,
    });

    const userCompare = await this.userSchema.findById(userIdToCompare, {
      _id: true,
      friends: true,
    });

    if (!user || !userCompare) {
      throw new HttpException('Users not found', 404);
    }

    try {
      const isFriends =
        user.friends.includes(userCompare?._id) &&
        userCompare.friends.includes(user?._id);

      return isFriends;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
