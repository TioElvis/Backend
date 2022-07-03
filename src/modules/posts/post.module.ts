import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/post-schema';
import { User, UserSchema } from 'src/schemas/user-schema';
import { PostsController } from './controllers/post-controller/index.controller';
import { CreatePostService } from './services/create-post';
import { GetAllPService } from './services/get/all-posts';
import { ByIdService } from './services/get/by-id';
import { NewFromMeAndFriendsService } from './services/get/new-posts-from-me-and-friends';
import { LikeController } from './controllers/like-post-controller/index.controller';
import { GiveLikeService } from './services/like-post/give-like-post';
import { GiveDislikeService } from './services/like-post/give-dislike-post';
import { ILikeThatService } from './services/like-post/i-like-that-post';
import { GetPeopleWhoLikeThisService } from './services/like-post/people-who-like-this-post';

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
