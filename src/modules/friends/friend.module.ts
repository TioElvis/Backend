import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/schemas/user-schema';
import { FriendController } from './controllers/friend-controller/index.controller';
import { FriendRequestController } from './controllers/friend-request-controller/index.controller';
import { isMyService } from './services/is-my-friend';
import { IHaveService } from './services/friend-request/i-have-friend-request';
import { ISentService } from './services/friend-request/i-sent-friend-request';
import { AcceptService } from './services/friend-request/accept';
import { RejectService } from './services/friend-request/reject';
import { CancelService } from './services/friend-request/cancel';
import { SendService } from './services/friend-request/send';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [FriendController, FriendRequestController],
  providers: [
    isMyService,
    IHaveService,
    ISentService,
    AcceptService,
    SendService,
    RejectService,
    CancelService,
  ],
})
export class FriendModule {}
