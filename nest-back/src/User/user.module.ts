import {Module} from '@nestjs/common';
import {UserController} from "./user.controller";
import {UserService} from "./userService";
import {PrismaService} from "../Prisma/prisma.service";
import {AuthModule} from "../auth/auth.module";

@Module(
    {
        imports:[AuthModule],
        controllers:[UserController],
        providers: [UserService, PrismaService],
    }
)
export class UserModule{}

