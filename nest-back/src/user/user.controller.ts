import {Body, Controller, Get, Post, Put, UseGuards,Request} from '@nestjs/common';
import {UserService} from "./user.service";
import {
    Workout,
    Exercise,
    Planner,
    Difficulty,
    Prisma
} from '@prisma/client';
import {Client} from "@prisma/client";
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return req.user;
    }
}