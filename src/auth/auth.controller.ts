import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() userObject: LoginDto) {
    return this.authService.login(userObject);
  }

  @Post('/register')
  register(@Body() userObject: RegisterDto) {
    return this.authService.register(userObject);
  }
}
