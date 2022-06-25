import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginUserService } from './services/login.service';
import { RegisterUserService } from './services/register.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly register: RegisterUserService,
    private readonly login: LoginUserService,
  ) {}

  @Post('/register')
  registerUser(@Body() registerDto: RegisterDto) {
    return this.register.registerUser(registerDto);
  }

  @Post('/login')
  loginUser(@Body() loginDto: LoginDto) {
    return this.login.loginUser(loginDto);
  }
}
