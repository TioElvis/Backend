import { Controller, Body, Param, Patch, Get } from '@nestjs/common';
import { SendFRDto } from './dto/sendFR.dto';
import { AcceptFRDto } from './dto/acceptFR.dto';
import { RejectFRDto } from './dto/rejectFR.dto';
import { ApiTags } from '@nestjs/swagger';
import { DeleteFDto } from './dto/deleteF.dto';
import { CancelFRDto } from './dto/cancelFR.dto';
import { SendFriendRequestService } from './services/sendFR.service';
import { RejectFriendRequestService } from './services/rejectFR.service';
import { MyFriendsService } from './services/myF.service';
import { IsMyFriendService } from './services/isMyF.service';
import { DeleteFriendService } from './services/deleteF.service';
import { CancelFriendRequetService } from './services/cancelFR.service';
import { AcceptFriendRequestService } from './services/acceptFR.service';
import { IsMyFriendDto } from './dto/isMyF.dto';

@ApiTags('friends')
@Controller('friend')
export class FriendsController {
  constructor(
    private readonly sendFriendRequestService: SendFriendRequestService,
    private readonly rejectFriendRequestService: RejectFriendRequestService,
    private readonly myFriendsService: MyFriendsService,
    private readonly isMyFriendService: IsMyFriendService,
    private readonly deleteFriendService: DeleteFriendService,
    private readonly cancelFriendRequestService: CancelFriendRequetService,
    private readonly acceptFriendRequestService: AcceptFriendRequestService,
  ) {}

  @Patch('/sendFriendRequest/:id')
  sendRF(@Param('id') id: string, @Body() snedFRDto: SendFRDto) {
    return this.sendFriendRequestService.sendFR(id, snedFRDto);
  }

  @Patch('/rejectFriendRequest/:id')
  rejectFR(@Param('id') id: string, @Body() rejectFRDto: RejectFRDto) {
    return this.rejectFriendRequestService.rejectFR(id, rejectFRDto);
  }

  @Patch('/acceptFriendRequest/:id')
  acceptFR(@Param('id') id: string, @Body() acceptFRDto: AcceptFRDto) {
    return this.acceptFriendRequestService.acceptFR(id, acceptFRDto);
  }

  @Patch('/cancelFriendRequest/:id')
  cancelFR(@Param('id') id: string, @Body() cancelFRdto: CancelFRDto) {
    return this.cancelFriendRequestService.cancelFR(id, cancelFRdto);
  }

  @Patch('/deleteFriendRequest/:id')
  deleteF(@Param('id') id: string, @Body() deleteFriendDto: DeleteFDto) {
    return this.deleteFriendService.deleteF(id, deleteFriendDto);
  }

  @Get('/:id')
  myF(@Param('id') id: string) {
    return this.myFriendsService.myF(id);
  }

  @Get('/isMyFriend/:id')
  isMyF(@Param('id') id: string, @Body() isMyFriendDto: IsMyFriendDto) {
    return this.isMyFriendService.isMyF(id, isMyFriendDto);
  }
}
