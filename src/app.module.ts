import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { FriendModule } from './modules/friends/friend.module';
import { PostModule } from './modules/posts/post.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
    AuthModule,
    UserModule,
    PostModule,
    FriendModule,
  ],
})
export class AppModule {}
