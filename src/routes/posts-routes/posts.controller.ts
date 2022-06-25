import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/libs/multer';
import { CreatePostDto } from './dto/createPost.dto';
import { CreateService } from './services/create.service';
import { GetAllPostsService } from './services/get/getAllPosts.service';
import { GetNewPostsService } from './services/get/getNewPosts.service';
import { GetPostByIdService } from './services/get/getPostById.service';
import { GiveDislikeService } from './services/likes/giveDislikePost.service';
import { GiveLikeService } from './services/likes/giveLikePost.service';
import { ILikePostService } from './services/likes/iLikePost.service';

@Controller('post')
export class PostsController {
  constructor(
    private readonly createPost: CreateService,
    private readonly giveLikePost: GiveLikeService,
    private readonly giveDislikePost: GiveDislikeService,
    private readonly iLikePost: ILikePostService,
    private readonly getAllPosts: GetAllPostsService,
    private readonly getNewPosts: GetNewPostsService,
    private readonly getPostById: GetPostByIdService,
  ) {}

  @Post('create/:userId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storage,
    }),
  )
  create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.createPost.createPost(userId, file, createPostDto);
  }

  @Patch('giveLike/:userId/:postId')
  giveLike(@Param('userId') userId: string, @Param('postId') postId: string) {
    return this.giveLikePost.giveLike(userId, postId);
  }

  @Patch('giveDislike/:userId/:postId')
  giveDislike(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.giveDislikePost.giveDislike(userId, postId);
  }

  @Get('iLike/:userId/:postId')
  iLike(@Param('userId') userId: string, @Param('postId') postId: string) {
    return this.iLikePost.iLike(userId, postId);
  }

  @Get('getAll')
  getAll() {
    return this.getAllPosts.getAll();
  }

  @Get('getPost/:postId')
  getById(@Param('postId') postId: string) {
    return this.getPostById.getById(postId);
  }

  @Get('/newPosts/:userId')
  getNew(@Param('userId') userId: string) {
    return this.getNewPosts.getNew(userId);
  }
}
