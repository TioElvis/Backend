import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { CreateService } from './services/create.service';
import { GiveLikeService } from './services/likes/giveLikePost.service';
import { GiveDislikeService } from './services/likes/giveDislikePost.service';
import { ILikePostService } from './services/likes/iLikePost.service';
import { GetNewPostsService } from './services/get/getNewPosts.service';
import { GetPostByIdService } from './services/get/getPostById.service';
import { PostsController } from './posts.controller';
import { GetAllPostsService } from './services/get/getAllPosts.service';

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
  controllers: [PostsController],
  providers: [
    CreateService,
    GiveLikeService,
    GiveDislikeService,
    ILikePostService,
    GetAllPostsService,
    GetNewPostsService,
    GetPostByIdService,
  ],
})
export class PostModule {}
