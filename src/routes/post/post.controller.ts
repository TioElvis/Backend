import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { CreatePDto } from './dto/createP.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeletePDto } from './dto/deleteP.dto';
import { storage } from 'src/libs/multer';

@ApiTags('posts')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
    return this.postsService.createP(createPDto, file, id);
  }

  @Delete('/delete/:id')
  findAllPosts(@Param('id') id: string, @Body() deletePDto: DeletePDto) {
    return this.postsService.deleteP(id, deletePDto);
  }
}
