import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('posts')
@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  newPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.newPost(createPostDto);
  }

  @Get()
  findAllPosts() {
    return this.postsService.findAllPosts();
  }
}
