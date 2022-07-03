import { Controller, Get, Param, Patch } from '@nestjs/common';
import { GiveDislikeService } from '../../services/like/give-dislike';
import { GiveLikeService } from '../../services/like/give-like';
import { ILikeThatService } from '../../services/like/i-like-that';
import { GetPeopleWhoLikeThisService } from '../../services/like/people-who-like-this';

@Controller('like-post')
export class LikeController {
  constructor(
    private readonly giveLike: GiveLikeService,
    private readonly giveDislike: GiveDislikeService,
    private readonly iLikeThat: ILikeThatService,
    private readonly getPeopleGiveLike: GetPeopleWhoLikeThisService,
  ) {}

  @Patch('give/:userId/:postId')
  giveLikePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.giveLike.post(userId, postId);
  }

  @Patch('remove/:userId/:postId')
  giveDislikePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.giveDislike.post(userId, postId);
  }

  @Get('i-that/:userId/:postId')
  iLikeThatPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.iLikeThat.post(userId, postId);
  }

  @Get('/get-people/:postId')
  getPeopleGiveLikePost(@Param('postId') postId: string) {
    return this.getPeopleGiveLike.post(postId);
  }
}
