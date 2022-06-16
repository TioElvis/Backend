import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { FriendsController } from './friends.controller';
import { AcceptFriendRequestService } from './services/acceptFR.service';
import { CancelFriendRequetService } from './services/cancelFR.service';
import { DeleteFriendService } from './services/deleteF.service';
import { IsMyFriendService } from './services/isMyF.service';
import { MyFriendsService } from './services/myF.service';
import { RejectFriendRequestService } from './services/rejectFR.service';
import { SendFriendRequestService } from './services/sendFR.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [FriendsController],
  providers: [
    SendFriendRequestService,
    RejectFriendRequestService,
    MyFriendsService,
    IsMyFriendService,
    DeleteFriendService,
    CancelFriendRequetService,
    AcceptFriendRequestService,
  ],
})
export class FriendsModule {}
