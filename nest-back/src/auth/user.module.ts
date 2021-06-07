import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./local.strategy";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {UserController} from "./user.controller"

@Module({

  controllers: [UserController],
  imports: [PassportModule, JwtModule.register({
    secret: 'SECRET', // TODO PUT THIS IN THE ENVIRONMENT VARIABLE!!!!!!!
    signOptions: {expiresIn: '60s'},
  })],
  providers: [UserService, LocalStrategy],
  exports: [UserService,JwtModule],
})
export class UserModule {}
