import {Module} from '@nestjs/common';
import {UserController} from "./user.controller";
import {UserService} from "./userService";
import {PrismaService} from "../Prisma/prisma.service";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";


@Module(
    {
        controllers:[UserController],
        providers: [UserService, PrismaService,AuthService],
        exports: [UserService]
    }
)
export class UserModule{}

