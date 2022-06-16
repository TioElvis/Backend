import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/libs/multer';
import { CreatePDto } from './dto/createP.dto';
import { CreatePostService } from './services/createPost.service';

@Controller('post')
export class PostsController {
  constructor(private readonly createPostsService: CreatePostService) {}

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
}
