import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';
import { hash } from 'bcrypt';
import { RegisterDto } from 'src/dtos/auth/register.dto';

@Injectable()
export class RegisterUserService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
  ) {}

  async user(registerDto: RegisterDto) {
    const { password, nickname, email } = registerDto;
    const hashPassword = await hash(password, 12);

    const findByNickname = await this.userSchema.findOne({
      nickname: nickname,
    });
    const findByEmail = await this.userSchema.findOne({ email: email });

    if (findByNickname) {
      throw new HttpException(
        'There is already a user with this nickname, try another',
        400,
      );
    }

    if (findByEmail) {
      throw new HttpException(
        'There is already a user with this email, try another',
        400,
      );
    }

    registerDto = { ...registerDto, password: hashPassword };

    try {
      await this.userSchema.create(registerDto);
      return 'The user has been successfully registered';
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
