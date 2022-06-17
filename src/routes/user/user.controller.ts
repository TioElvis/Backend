import {
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/libs/multer';
import { GetUserService } from './services/get/getUser.service';
import { NewPostsService } from './services/get/newPosts.service';
import { UpdateAvatarService } from './services/patch/updateAvatar.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly newPostsService: NewPostsService,
    private readonly updateAvatarService: UpdateAvatarService,
    private readonly getUserService: GetUserService,
  ) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.getUserService.getUser(id);
  }

  @Get('newPosts/:id')
  newPosts(@Param('id') id: string) {
    return this.newPostsService.newPosts(id);
  }

  @Patch('updateAvatar/:id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storage,
    }),
  )
  updateAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.updateAvatarService.updateAvatar(id, file);
  }
}
