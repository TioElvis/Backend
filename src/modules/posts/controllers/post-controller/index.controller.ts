import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/libs/multer';
import { CreatePostDto } from '../../../../dtos/post/createPost.dto';
import { CreatePostService } from '../../services/create';
import { GetAllPService } from '../../services/get/all-posts';
import { NewFromMeAndFriendsService } from '../../services/get/new-posts-from-me-and-friends';
import { ByIdService } from '../../services/get/by-id';

@Controller('post')
export class PostsController {
  constructor(
    private readonly create: CreatePostService,
    private readonly getAll: GetAllPService,
    private readonly getNew: NewFromMeAndFriendsService,
    private readonly getById: ByIdService,
  ) {}

  @Post('create/:userId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storage,
    }),
  )
  createPost(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.create.post(userId, file, createPostDto);
  }

  @Get('getAll')
  getAllPosts() {
    return this.getAll.posts();
  }

  @Get('/:postId')
  getPostById(@Param('postId') postId: string) {
    return this.getById.post(postId);
  }

  @Get('/getNew/:userId')
  getNewPosts(@Param('userId') userId: string) {
    return this.getNew.posts(userId);
  }
}
