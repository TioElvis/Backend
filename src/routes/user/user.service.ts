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
      .catch(() => {
        throw new HttpException('User not found', 404);
      });

    // If the id has the same characters as the normal id but does not exist
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
      for (const idF of friends) {
        const posts = await this.postModel
          .find({ userId: idF })
          .populate('userId', {
            _id: 0,
            nickName: 1,
          });
        postFuntion(posts);
      }
    }

    // Doing sort to put the most recent posts first
    postsF.sort((post1: Post, post2: Post) => {
      return -post1.date + +post2.date;
    });

    return postsF;
  }
}
