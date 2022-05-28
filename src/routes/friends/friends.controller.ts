import { Controller, Body, Param, Patch } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { SendFRDto } from './dto/sendFR.dto';
import { AcceptFRDto } from './dto/acceptFR.dto';
import { RejectFRDto } from './dto/rejectFR.dto';
import { ApiTags } from '@nestjs/swagger';
import { DeleteFDto } from './dto/deleteF.dto';
import { CancelFRDto } from './dto/cancelFR.dto';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Patch('/send/:id')
  sendRequest(@Param('id') id: string, @Body() snedFRDto: SendFRDto) {
    return this.friendsService.sendRequest(id, snedFRDto);
  }

  @Patch('/accept/:id')
  acceptRequest(@Param('id') id: string, @Body() acceptFRDto: AcceptFRDto) {
    return this.friendsService.acceptRequest(id, acceptFRDto);
  }

  @Patch('/reject/:id')
  rejectRequest(@Param('id') id: string, @Body() rejectFRDto: RejectFRDto) {
    return this.friendsService.rejectRequest(id, rejectFRDto);
  }

  @Patch('/delete/:id')
  deleteFriend(@Param('id') id: string, @Body() deleteFriendDto: DeleteFDto) {
    return this.friendsService.deleteFriend(id, deleteFriendDto);
  }

  @Patch('/cancel/:id')
  cancelRequest(@Param('id') id: string, @Body() cancelFRdto: CancelFRDto) {
    return this.friendsService.cancelRequest(id, cancelFRdto);
  }
}
