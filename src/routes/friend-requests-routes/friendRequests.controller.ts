import { Body, Controller, Param, Patch } from '@nestjs/common';
import { AcceptDto } from './dto/accept.dto';
import { RejectDto } from './dto/reject.dto';
import { SendDto } from './dto/send.dto';
import { AcceptService } from './services/accept.service';
import { RejectService } from './services/reject.service';
import { SendService } from './services/send.service';
import { CancelService } from './services/cancel.service';
import { CancelDto } from './dto/cancel.dto';

@Controller('friendRequest')
export class FriendRequestsController {
  constructor(
    private readonly send: SendService,
    private readonly reject: RejectService,
    private readonly accept: AcceptService,
    private readonly cancel: CancelService,
  ) {}

  @Patch('send/:userId')
  sendFriendRequest(@Param('userId') userId: string, @Body() sendDto: SendDto) {
    return this.send.sendFriendRequest(userId, sendDto);
  }

  @Patch('reject/:userId')
  rejectFriendRequest(
    @Param('userId') userId: string,
    @Body() rejectDto: RejectDto,
  ) {
    return this.reject.rejectFriendRequest(userId, rejectDto);
  }

  @Patch('accept/:userId')
  acceptFriendRequest(
    @Param('userId') userId: string,
    @Body() acceptDto: AcceptDto,
  ) {
    return this.accept.acceptFriendRequest(userId, acceptDto);
  }

  @Patch('cancel/:userId')
  cancelFriendRequest(
    @Param('userId') userId: string,
    @Body() cancelDto: CancelDto,
  ) {
    return this.cancel.cancelFriendRequest(userId, cancelDto);
  }
}
