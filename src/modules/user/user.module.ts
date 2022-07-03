import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/schemas/user-schema';
import { Post, PostSchema } from 'src/schemas/post-schema';
import { ByIdService } from './service/get/user-by-id';
import { UserController } from './controllers/user.controller';
import { UpdateAvatarService } from './service/update-avatar';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [ByIdService, UpdateAvatarService],
})
export class UserModule {}
