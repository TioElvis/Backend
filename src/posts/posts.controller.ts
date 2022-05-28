import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePDto } from './dto/createP.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'path';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/create/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file: any | undefined, cb) => {
          const filename: string = uuidv4();
          const ext: string = parse(file.originalname).ext;
          cb(null, `${filename}${ext}`);
        },
      }),
    }),
  )
  createP(
    @Body() createPDto: CreatePDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.postsService.createP(createPDto, file, id);
  }

  @Get()
  findAllPosts() {
    return this.postsService.findAllPosts();
  }
}
