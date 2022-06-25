import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { FriendRequestsController } from './friendRequests.controller';
import { AcceptService } from './services/accept.service';
import { CancelService } from './services/cancel.service';
import { RejectService } from './services/reject.service';
import { SendService } from './services/send.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [FriendRequestsController],
  providers: [AcceptService, SendService, RejectService, CancelService],
})
export class FriendRequestsModule {}
