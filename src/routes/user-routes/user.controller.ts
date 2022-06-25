import { Controller, Get, Param } from '@nestjs/common';
import { GetUserByIdService } from './service/getUserById.service';

@Controller('user')
export class UserController {
  constructor(private readonly getUserById: GetUserByIdService) {}

  @Get(':userId')
  getById(@Param('userId') userId: string) {
    return this.getUserById.getById(userId);
  }
}
