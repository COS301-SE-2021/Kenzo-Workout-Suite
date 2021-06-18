import {Body, Controller, Get, Post, Put, UseGuards, Request, Req} from '@nestjs/common';
import {UserService} from "./user.service";
import { AuthGuard } from '@nestjs/passport';
import {LocalAuthGuard} from "./local-auth.guard";
import {JwtAuthGuard} from "./jwt-auth.guard";
import {User} from "@prisma/client";
import {ActualPrisma} from "../../context";
import {v4 as uuidv4 } from 'uuid';
import {ApiBearerAuth, ApiBody} from "@nestjs/swagger";


@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @Post('signUp')
    signUpUser(
        @Body('User') user: User,
    ) {
        return this.userService.signUp(user,ActualPrisma());
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.userService.login(req.user);
    }

    @Get('googleLogin')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('googleRedirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return this.userService.googleLogin(req)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('getUserDetails')
    getUserData(@Request() req){
        return this.userService.findUserByUUID(req.user.userId,ActualPrisma())
    }

    @UseGuards(JwtAuthGuard)
    @Put('updateUserDetail')
    updateUserDetail(@Request() req,
                     @Body('firstName') firstName: string,
                     @Body('lastName') lastName: string,
                     @Body('dateOfBirth') dateOfBirth: Date){
        return this.userService.updateUserDetails(firstName,lastName,dateOfBirth,req.user.userId,ActualPrisma())
    }
}