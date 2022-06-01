import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './routes/auth/auth.module';
import { UsersModule } from './routes/user/user.module';
import { FriendsModule } from './routes/friend/friend.module';
import { PostsModule } from './routes/post/post.module';
import { GroupModule } from './routes/group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    FriendsModule,
    PostsModule,
    UsersModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
