import {Body, Controller, Get, Post, Put, UseGuards,Request} from '@nestjs/common';
import {UserService} from "./user.service";
import { AuthGuard } from '@nestjs/passport';
import {LocalAuthGuard} from "./local-auth.guard";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {Client} from "@prisma/client";


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
        return req.user;
    }

    @Post('signUpClient')
    signUpClient(
        @Body('Client') client: Client,
    ) {
        return this.userService.signUpClient(client);
    }

}