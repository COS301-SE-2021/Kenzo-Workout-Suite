import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import {PrismaService} from "../Prisma/prisma.service";
import {UserController} from "./user.controller";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {JwtStrategy} from "./jwt.strategy";
import {GoogleStrategy} from "./google.strategy";

@Module({
  imports: [ PassportModule, JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  }),],

  providers: [UserService, LocalStrategy,PrismaService,JwtStrategy,GoogleStrategy],
  controllers: [UserController]
})
export class UserModule {}
