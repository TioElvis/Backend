import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthController } from './auth.controller';
import { RegisterUserService } from './services/register.service';
import { JwtStrategy } from 'src/libs/jwt/jwt.strategy';
import { LoginUserService } from './services/login.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.register({
      secret: `${process.env.JWS_SECRET}`,
      signOptions: { expiresIn: '168h' },
    }),
  ],
  controllers: [AuthController],
  providers: [RegisterUserService, LoginUserService, JwtStrategy],
})
export class AuthModule {}
