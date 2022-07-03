import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from 'src/dtos/auth/login.dto';
import { RegisterDto } from 'src/dtos/auth/register.dto';
import { LoginUserService } from '../services/login-user-service';
import { RegisterUserService } from '../services/register-user-service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly register: RegisterUserService,
    private readonly login: LoginUserService,
  ) {}

  @Post('/register')
  registerUser(@Body() registerDto: RegisterDto) {
    return this.register.user(registerDto);
  }

  @Post('/login')
  loginUser(@Body() loginDto: LoginDto) {
    return this.login.user(loginDto);
  }
}
