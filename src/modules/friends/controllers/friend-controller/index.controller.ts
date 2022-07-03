import { Controller, Get, Param } from '@nestjs/common';
import { isMyService } from '../../services/is-my-friend';

@Controller('friend')
export class FriendController {
  constructor(private readonly isMy: isMyService) {}

  @Get('/is-my/:userId/:userIdToCompare')
  isMyFriend(
    @Param('userId') userId: string,
    @Param('userIdToCompare') userIdToCompare: string,
  ) {
    return this.isMy.friend(userId, userIdToCompare);
  }
}
