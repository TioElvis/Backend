import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Post, PostDocument } from 'src/schemas/post.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  // Route find user
  async findUser(id: string) {
    const findUser = await this.userModel.findById(id);
    return findUser;
  }

  // Route posts friends
  async friendsP(id: string) {
    const user = await this.userModel
      .findById(id, {
        _id: false,
        friends: true,
      })
      .populate({
        path: 'friends',
        select: { _id: true, posts: true },
        populate: { path: 'posts' },
      })
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const friends = user.friends;
    const postsF = [] as Post[];

    // This function makes a loop to grab the posts sent to the user and put them in a single json
    const postFuntion = (posts: Post[]) => {
      for (const post of posts) {
        postsF.push(post);
      }
    };

    // If there are friends
    if (friends) {
      for (const post of friends) {
        postFuntion(post.posts);
      }
    }

    return postsF;
  }
}
