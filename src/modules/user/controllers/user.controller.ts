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
import { ByIdService } from '../service/get/user-by-id';
import { UpdateAvatarService } from '../service/update-avatar';

@Controller('user')
export class UserController {
  constructor(
    private readonly getById: ByIdService,
    private readonly update: UpdateAvatarService,
  ) {}

  @Get(':userId')
  getUserById(@Param('userId') userId: string) {
    return this.getById.user(userId);
  }

  @Patch('updateAvatar/:userId')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storage,
    }),
  )
  updateAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.update.avatar(userId, file);
  }
}
