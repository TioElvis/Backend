import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { RegisterUserService } from './services/register-user-service';
import { LoginUserService } from './services/login-user-service';
import { User, UserSchema } from 'src/schemas/user-schema';
import { JwtStrategy } from 'src/libs/jwt/jwt.strategy';

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
