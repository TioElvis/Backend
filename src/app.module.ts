import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './routes/auth-routes/auth.module';
import { PostModule } from './routes/posts-routes/post.module';
import { UserModule } from './routes/user-routes/user.module';
import { FriendRequestsModule } from './routes/friend-requests-routes/friendRequests.module';

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
    FriendRequestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
