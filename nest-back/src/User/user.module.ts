import {Module} from '@nestjs/common';
import {UserController} from "./user.controller";
import {UserService} from "./userService";
import {PrismaService} from "../Prisma/prisma.service";

@Module(
    {
        controllers:[UserController],
        providers: [UserService, PrismaService],
    }
)
export class UserModule{}

