import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePDto } from './dto/createP.dto';
import { Post, PostDocument } from './schema/posts.schema';
import { Model } from 'mongoose';
import { uploadImage } from './libs/cloudinary';
import { remove } from 'fs-extra';
import { User, UserDocument } from 'src/users/schema/users.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Route create post
  async createP(
    createPostDto: CreatePDto,
    file: Express.Multer.File,
    id: string,
  ) {
    const { description } = createPostDto;
    let image;

    // Extracting user information
    const userCreatingPost = await this.userModel
      .findById(id, {
        _id: true,
        nickName: true,
      })
      .catch(() => {
        throw new HttpException(
          'User who wants to create a post has not been found',
          404,
        );
      });

    // If there is no image and description
    if (!file && !description) {
      throw new HttpException('Add a text or an image to create a post', 400);
    }

    // If there is an image
    if (file) {
      const result = await uploadImage(file.path);
      image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
      await remove(file.path);
    }

    // Creating the post
    const payload = {
      userId: id,
      description: description,
      image: image,
    };

    const newPost = await this.postModel.create(payload);

    const postId = newPost?._id;

    // Updating
    await userCreatingPost?.updateOne({
      $push: {
        posts: postId,
      },
    });

    return `${userCreatingPost?.nickName} you have created a post successfully`;
  }

  async findAllPosts() {
    const postFindAll = await this.postModel.find();
    return postFindAll;
  }
}
