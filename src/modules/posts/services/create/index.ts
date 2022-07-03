import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user-schema';
import { PostDocument, Post, Image } from 'src/schemas/post-schema';
import { remove } from 'fs-extra';
import { uploadImage } from 'src/libs/cloudinary';
import { CreatePostDto } from 'src/dtos/post/createPost.dto';

@Injectable()
export class CreatePostService {
  constructor(
    @InjectModel(User.name) private userSchema: Model<UserDocument>,
    @InjectModel(Post.name) private postSchema: Model<PostDocument>,
  ) {}

  async post(
    userId: string,
    file: Express.Multer.File,
    createPDto: CreatePostDto,
  ) {
    const { description } = createPDto;
    let image: Image;

    const user = await this.userSchema
      .findById(userId, {
        _id: true,
        posts: true,
      })
      .catch(() => {
        throw new HttpException('Something went wrong', 400);
      });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (!file && !description) {
      throw new HttpException('Add a text or an image to create a post', 400);
    }

    if (file) {
      const result = await uploadImage(file.path);
      image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
      await remove(file.path);
    }

    try {
      const payload = {
        userId: userId,
        description: description,
        image: image,
      };

      const post = await this.postSchema.create(payload);

      const postId = await post._id;

      return postId;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
