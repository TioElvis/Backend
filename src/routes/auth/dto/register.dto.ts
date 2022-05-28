import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends PartialType(LoginDto) {
  @IsNotEmpty()
  nickName: string;
}
