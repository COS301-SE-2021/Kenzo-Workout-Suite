import {Body, Controller, Get, Post, Put, UseGuards, Request, Req} from '@nestjs/common';
import {UserService} from "./user.service";
import { AuthGuard } from '@nestjs/passport';
import {LocalAuthGuard} from "./local-auth.guard";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {User} from "@prisma/client";
import {ActualPrisma} from "../../context";


@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.userService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('protected')
    doSomething(@Request() req){
        console.log(req.user);
        return req.user;
    }

    @Post('signUp')
    signUpClient(
        @Body('User') user: User,
    ) {
        return this.userService.signUp(user,ActualPrisma());
    }

    @Get('googleLogin')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('googleRedirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return this.userService.googleLogin(req)
    }

}