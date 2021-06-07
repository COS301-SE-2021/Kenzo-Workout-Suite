import {Body, Controller, Get, Post, Put, UseGuards,Request} from '@nestjs/common';
import {UserService} from "./user.service";
import {LocalAuthGuard} from "./local-auth.guard";


@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Post('signUpClient')
    signUpClient(
        @Body('firstName') firstName: string,
        @Body('lastName') lastName: string,
        @Body('email') email: string,
        @Body('password') password: string,

    ) {
        return null;
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
