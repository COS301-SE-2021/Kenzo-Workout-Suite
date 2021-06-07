import {Body, Controller, Get, Post, Put, UseGuards,Request} from '@nestjs/common';
import {UserService} from "./userService";
import {LocalAuthGuard} from "../auth/local-auth.guard";
import {AuthService} from "../auth/auth.service";

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
        return this.userService.signUpClient(firstName,lastName,password,email);
    }

    @Post('signupPlanner')
    signupPlanner(
        @Body('firstName') firstName: string,
        @Body('lastName') lastName: string,
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.userService.signUpPlanner(firstName,lastName,email,password);
    }

    @UseGuards(LocalAuthGuard)
    @Post('signIn')
    signIn(@Request() req) : any
    {
      return null;
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
        return this.userService.updateUser(firstName,lastName,password,email);
    }


}
