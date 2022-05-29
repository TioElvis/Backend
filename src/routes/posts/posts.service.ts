import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePDto } from './dto/createP.dto';
import { Model } from 'mongoose';
import { remove } from 'fs-extra';
import { DeletePDto } from './dto/deleteP.dto';
import { Posts, PostDocument } from 'src/routes/posts/schema/posts.schema';
import { Users, UserDocument } from 'src/routes/users/schema/users.schema';
import { deleteImage, uploadImage } from 'src/libs/cloudinary';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostDocument>,
    @InjectModel(Users.name) private userModel: Model<UserDocument>,
  ) {}

  // Route create post
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
        friends: true,
      })
      .populate('friends', { _id: 1 })
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

    const { friends } = userCreatingPost;

    if (friends) {
      for (const friendId of friends) {
        const postsFreinds = await this.userModel.findById(friendId, {
          postsFriends: true,
        });

        await postsFreinds?.updateOne({
          $push: {
            postsFriends: newPost?._id,
          },
        });
      }
    }

    // Updating
    await userCreatingPost?.updateOne({
      $push: {
        posts: postId,
      },
    });

    return `${userCreatingPost?.nickName} you have created a post successfully`;
  }

  // Route Delete Post
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

    // if not found user's posts
    if (!userDeleting || !postToDelete) {
      throw new HttpException('User or publication not found', 400);
    }

    // if not my post
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
      await deleteImage(image?.public_id);
    }

    // Updating
    await userDeleting?.updateOne({
      $pull: {
        posts: postToDelete?._id,
      },
    });

    await postToDelete.delete();

    return `${userDeleting.nickName} you have successfully deleted a post`;
  }
}
