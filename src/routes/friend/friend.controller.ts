import { Controller, Body, Param, Patch } from '@nestjs/common';
import { FriendsService } from './friend.service';
import { SendFRDto } from './dto/sendFR.dto';
import { AcceptFRDto } from './dto/acceptFR.dto';
import { RejectFRDto } from './dto/rejectFR.dto';
import { ApiTags } from '@nestjs/swagger';
import { DeleteFDto } from './dto/deleteF.dto';
import { CancelFRDto } from './dto/cancelFR.dto';

@ApiTags('friends')
@Controller('friend')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Patch('/send/:id')
  sendRF(@Param('id') id: string, @Body() snedFRDto: SendFRDto) {
    return this.friendsService.sendFR(id, snedFRDto);
  }

  @Patch('/accept/:id')
  acceptFR(@Param('id') id: string, @Body() acceptFRDto: AcceptFRDto) {
    return this.friendsService.acceptFR(id, acceptFRDto);
  }

  @Patch('/reject/:id')
  rejectFR(@Param('id') id: string, @Body() rejectFRDto: RejectFRDto) {
    return this.friendsService.rejectFR(id, rejectFRDto);
  }

  @Patch('/cancel/:id')
  cancelFR(@Param('id') id: string, @Body() cancelFRdto: CancelFRDto) {
    return this.friendsService.cancelFR(id, cancelFRdto);
  }

  @Patch('/delete/:id')
  deleteF(@Param('id') id: string, @Body() deleteFriendDto: DeleteFDto) {
    return this.friendsService.deleteF(id, deleteFriendDto);
  }
}
