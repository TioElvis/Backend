import { Controller, Get, Param, Patch } from '@nestjs/common';
import { AcceptService } from '../../services/friend-request/accept';
import { CancelService } from '../../services/friend-request/cancel';
import { IHaveService } from '../../services/friend-request/i-have-friend-request';
import { ISentService } from '../../services/friend-request/i-sent-friend-request';
import { RejectService } from '../../services/friend-request/reject';
import { SendService } from '../../services/friend-request/send';

@Controller('friend-request')
export class FriendRequestController {
  constructor(
    private readonly send: SendService,
    private readonly reject: RejectService,
    private readonly accept: AcceptService,
    private readonly cancel: CancelService,
    private readonly iHave: IHaveService,
    private readonly iSent: ISentService,
  ) {}

  @Patch('send/:userId/:requestTo')
  sendFriendRequest(
    @Param('userId') userId: string,
    @Param('requestTo') userIdTo: string,
  ) {
    return this.send.friendRequest(userId, userIdTo);
  }

  @Patch('reject/:userId/:requestTo')
  rejectFriendRequest(
    @Param('userId') userId: string,
    @Param('requestTo') userIdTo: string,
  ) {
    return this.reject.friendRequest(userId, userIdTo);
  }

  @Patch('accept/:userId/:requestTo')
  acceptFriendRequest(
    @Param('userId') userId: string,
    @Param('requestTo') userIdTo: string,
  ) {
    return this.accept.friendRequest(userId, userIdTo);
  }

  @Patch('cancel/:userId/:requestTo')
  cancelFrienRequest(
    @Param('userId') userId: string,
    @Param('requestTo') userIdTo: string,
  ) {
    return this.cancel.friendRequest(userId, userIdTo);
  }

  @Get('i-have/:userId/:userIdToCompare')
  iHaveFriendRequest(
    @Param('userId') userId: string,
    @Param('userIdToCompare') userIdToCompare: string,
  ) {
    return this.iHave.friendRequest(userId, userIdToCompare);
  }

  @Get('i-sent/:userId/:userIdToCompare')
  iSentFriendRequest(
    @Param('userId') userId: string,
    @Param('userIdToCompare') userIdToCompare: string,
  ) {
    return this.iSent.friendRequest(userId, userIdToCompare);
  }
}
