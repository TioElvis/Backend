import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { hash, compare } from 'bcrypt';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtAuthService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, nickname, email } = registerDto;
    const hashPassword = await hash(password, 12);

    const findByNickname = await this.userModel.findOne({ nickname: nickname });
    const findByEmail = await this.userModel.findOne({ email: email });

    if (findByNickname) {
      throw new HttpException(
        'There is already a user with this nickname, try another',
        401,
      );
    }

    if (findByEmail) {
      throw new HttpException(
        'There is already a user with this email, try another',
        401,
      );
    }

    registerDto = { ...registerDto, password: hashPassword };

    return this.userModel.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne(
      { email: email },
      {
        _id: true,
        password: true,
      },
    );

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const passwordToCompare = user?.password;

    const checkPassword = await compare(password, passwordToCompare);

    if (!checkPassword) {
      throw new HttpException('Password is invalid', 401);
    }

    const id = user?._id;

    const payload = { id: id };
    const token = this.jwtAuthService.sign(payload);

    const data = {
      id,
      token,
    };

    return data;
  }
}
