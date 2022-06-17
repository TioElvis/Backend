import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { UsersController } from './user.controller';
import { NewPostsService } from './services/get/newPosts.service';
import { UpdateAvatarService } from './services/patch/updateAvatar.service';
import { GetUserService } from './services/get/getUser.service';

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
  controllers: [UsersController],
  providers: [NewPostsService, UpdateAvatarService, GetUserService],
})
export class UsersModule {}
