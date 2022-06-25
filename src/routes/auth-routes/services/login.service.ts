import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, User } from 'src/schemas/user.schema';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginUserService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
    private jwtAuthService: JwtService,
  ) {}

  async loginUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userSchema.findOne(
      { email: email },
      { _id: true, password: true },
    );

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const checkPassword = await compare(password, user?.password);

    if (!checkPassword) {
      throw new HttpException('Password is invalid', 400);
    }

    try {
      const id = user?._id;

      const payload = { id: id };
      const token = this.jwtAuthService.sign(payload);

      const data = {
        id,
        token,
      };

      return data;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
