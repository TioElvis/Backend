import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { PostDocument, Post, Image } from 'src/schemas/post.schema';
import { CreatePDto } from '../dto/createP.dto';
import { uploadImage } from 'src/libs/cloudinary';
import { remove } from 'fs-extra';

export class CreatePostService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  // Route create post
  async createP(createPDto: CreatePDto, file: Express.Multer.File, id: string) {
    const { description } = createPDto;
    let image: Image;

    // Extracting user information
    const userCreatingPost = await this.userModel.findById(id, {
      _id: true,
      nickname: true,
      posts: true,
    });

    // If the user no exist
    if (!userCreatingPost) {
      throw new HttpException('User not found', 404);
    }

    // If there is no image or description
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

    // Creating
    await this.postModel.create(payload);

    return `${userCreatingPost?.nickname} you have created a post successfully`;
  }
}
