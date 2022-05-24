import { Controller, Body, Param, Delete, Patch } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { SendRequestFriendDto } from './dto/sendRequestFriendDto.dto';
import { AcceptRequestFriendDto } from './dto/acceptRequestFriendDto.dto';

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

  @Delete('/a/:id')
  rejectRequest(@Param('id') id: string) {
    return this.friendsService.rejectRequest(id);
  }
}
