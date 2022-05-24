import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './schema/posts.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async newPost(createPostDto: CreatePostDto) {
    const postCreate = await this.postModel.create(createPostDto);
    return postCreate;
  }

  async findAllPosts() {
    const postFindAll = await this.postModel.find();
    return postFindAll;
  }
}
