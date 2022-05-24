import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { hash, compare } from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtAuthService: JwtService,
  ) {}

  async register(userObject: RegisterDto) {
    const { password } = userObject;
    const hashPassword = await hash(password, 12);

    userObject = { ...userObject, password: hashPassword };

    return this.userModel.create(userObject);
  }

  async login(userObject: LoginDto) {
    const { email, password } = userObject;
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const passwordToCompare = user.password;

    const checkPassword = await compare(password, passwordToCompare);

    if (!checkPassword) {
      throw new HttpException('Password is invalid', 401);
    }

    const payload = { id: user._id };
    const token = this.jwtAuthService.sign(payload);

    const data = {
      user,
      token,
    };

    return data;
  }
}
