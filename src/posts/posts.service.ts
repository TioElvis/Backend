import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePDto } from './dto/createP.dto';
import { Model } from 'mongoose';
import { remove } from 'fs-extra';
import { Post, PostDocument } from './schema/posts.schema';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { deleteImage, uploadImage } from './libs/cloudinary';
import { DeletePDto } from './dto/deleteP.dto';

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

  async deleteP(id: string, deletePDto: DeletePDto) {
    const { idPostToDelete } = deletePDto;

    // Extracting information
    const userDeleting = await this.userModel
      .findById(id, {
        _id: true,
        posts: true,
        nickName: true,
      })
      .catch(() => {
        throw new HttpException('User to delete post not found', 404);
      });

    const postToDelete = await this.postModel
      .findById(idPostToDelete, {
        _id: true,
        image: true,
      })
      .catch(() => {
        throw new HttpException('post to delete not found', 404);
      });

    if (!userDeleting) {
      throw new HttpException('User not found, thats why this error', 404);
    }

    const { posts } = userDeleting;

    const isMyPost = posts.includes(postToDelete?._id);

    if (!isMyPost) {
      throw new HttpException(
        'This post was not created by you, therefore you cannot delete it',
        400,
      );
    }

    const { image } = postToDelete;

    if (image) {
      await deleteImage(image.public_id);
    }

    await postToDelete.delete();

    await userDeleting?.updateOne({
      $pull: {
        posts: postToDelete?._id,
      },
    });

    return `${userDeleting.nickName} you have successfully deleted a post`;
  }
}
