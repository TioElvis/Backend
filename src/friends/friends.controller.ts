import { Controller, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { SendRequestFriendDto } from './dto/sendRequestFriendDto.dto';
import { AcceptRequestFriendDto } from './dto/acceptRequestFriendDto.dto';
import { RejectRequestFriendDto } from './dto/rejectRequestFriendDto.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { DeleteFriendDto } from './dto/deleteFriendDto.dto';

@ApiBearerAuth()
@ApiTags('friends')
@UseGuards(JwtGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Patch('/send/:id')
  sendRequest(
    @Param('id') id: string,
    @Body() sendRequestFriendDto: SendRequestFriendDto,
  ) {
    return this.friendsService.sendRequest(id, sendRequestFriendDto);
  }

  @Patch('/accept/:id')
  acceptRequest(
    @Param('id') id: string,
    @Body() acceptRequestFriendDto: AcceptRequestFriendDto,
  ) {
    return this.friendsService.acceptRequest(id, acceptRequestFriendDto);
  }

  @Patch('/reject/:id')
  rejectRequest(
    @Param('id') id: string,
    @Body() rejectRequestFriendDto: RejectRequestFriendDto,
  ) {
    return this.friendsService.rejectRequest(id, rejectRequestFriendDto);
  }

  @Patch('/delete/:id')
  deleteFriend(
    @Param('id') id: string,
    @Body() deleteFriendDto: DeleteFriendDto,
  ) {
    return this.friendsService.deleteFriend(id, deleteFriendDto);
  }
}
