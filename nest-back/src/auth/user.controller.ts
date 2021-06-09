import {Body, Controller, Get, Post, Put, UseGuards,Request} from '@nestjs/common';
import {UserService} from "./user.service";
import {LocalAuthGuard} from "./local-auth.guard";
import {
    Workout,
    Exercise,
    Planner,
    Difficulty,
    Prisma
} from '@prisma/client';
import {Client} from "@prisma/client";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Post('signUpClient')
    signUpClient(
        @Body('Client') client: Client,
    ) {
        return this.userService.signUpClient(client);
    }

    @Post('signupPlanner')
    signupPlanner(
        @Body('firstName') firstName: string,
        @Body('lastName') lastName: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return null;
    }

    @UseGuards(LocalAuthGuard)
    @Post('signIn')
    signIn(@Request() req) : any
    {
        console.log("JHELLO DO YOU EVEN MAKE IT HERE");
        return this.userService.login(req.user);
    }

    @Get('protected')
    getHello(@Request() req): string{
        return "hello";
    }

    @Put('updateUser')
    updateUser(
        @Body('email') firstName: string,
        @Body('firstName') lastName: string,
        @Body('lastName') email: string,
        @Body('dateOfBirth') password: string,
    ) {
        return null;
    }

}
