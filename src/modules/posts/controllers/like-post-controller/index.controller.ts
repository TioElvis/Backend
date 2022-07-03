import { Controller, Get, Param, Patch } from '@nestjs/common';
import { GiveDislikeService } from '../../services/like-post/give-dislike-post';
import { GiveLikeService } from '../../services/like-post/give-like-post';
import { ILikeThatService } from '../../services/like-post/i-like-that-post';
import { GetPeopleWhoLikeThisService } from '../../services/like-post/people-who-like-this-post';

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
