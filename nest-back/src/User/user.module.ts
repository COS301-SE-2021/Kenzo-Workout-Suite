import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './PassportStrategies/local.strategy';
import {UserController} from "./user.controller";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./PassportStrategies/jwt.strategy";
import {GoogleStrategy} from "./PassportStrategies/google.strategy";

@Module({
  imports: [ PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.EXPIRY_TIME },
  }),],

  providers: [UserService, LocalStrategy,JwtStrategy,GoogleStrategy],
  controllers: [UserController]
})
export class UserModule {}
