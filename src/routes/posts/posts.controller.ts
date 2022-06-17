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
import { CreatePDto } from './dto/createP.dto';
import { CreatePostService } from './services/createPost.service';
import { DisLikeThatPostService } from './services/dislikeThatPost.service';
import { GetPostByIdService } from './services/getPostById.service';
import { LikeThatPostService } from './services/likeThatPost.service';

@Controller('post')
export class PostsController {
  constructor(
    private readonly createPostsService: CreatePostService,
    private readonly getPostByIdService: GetPostByIdService,
    private readonly likeThatPostService: LikeThatPostService,
    private readonly disLikeThatPostService: DisLikeThatPostService,
  ) {}

  @Get('/:id')
  getPById(@Param('id') id: string) {
    return this.getPostByIdService.getPById(id);
  }

  @Post('/create/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: storage,
    }),
  )
  createP(
    @Body() createPDto: CreatePDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.createPostsService.createP(createPDto, file, id);
  }

  @Patch('/likeThatPost/:userId/:postId')
  likeThatP(@Param('userId') userId: string, @Param('postId') postId: string) {
    return this.likeThatPostService.likeThatP(userId, postId);
  }

  @Patch('/dislikeThatPost/:userId/:postId')
  dislikeThatP(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.disLikeThatPostService.dislikeThatP(userId, postId);
  }
}
