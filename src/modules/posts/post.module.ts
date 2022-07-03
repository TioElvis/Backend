import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/post-schema';
import { User, UserSchema } from 'src/schemas/user-schema';
import { LikeController } from './controllers/like-post-controller/index.controller';
import { PostsController } from './controllers/post-controller/index.controller';
import { CreatePostService } from './services/create';
import { GetAllPService } from './services/get/all-posts';
import { ByIdService } from './services/get/by-id';
import { NewFromMeAndFriendsService } from './services/get/new-posts-from-me-and-friends';
import { GiveDislikeService } from './services/like/give-dislike';
import { GiveLikeService } from './services/like/give-like';
import { ILikeThatService } from './services/like/i-like-that';
import { GetPeopleWhoLikeThisService } from './services/like/people-who-like-this';

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
  controllers: [PostsController, LikeController],
  providers: [
    CreatePostService,
    GetAllPService,
    NewFromMeAndFriendsService,
    ByIdService,
    GiveLikeService,
    GiveDislikeService,
    ILikeThatService,
    GetPeopleWhoLikeThisService,
  ],
})
export class PostModule {}
