import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { PostsController } from './posts.controller';
import { CreatePostService } from './services/createPost.service';

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
  providers: [CreatePostService],
})
export class PostModule {}
