import {MockContext, Context, createMockContext, ActualPrisma} from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';
import {v4 as uuidv4 } from 'uuid';

import {
    User,
    userType,
    Prisma
} from '@prisma/client';
import {BadRequestException} from "@nestjs/common";
import {create} from "domain";


let mockCtx: MockContext
let ctx: Context

let userService: UserService
let Jwt : JwtService

beforeEach(async () => {
    userService=new UserService(Jwt)
    ctx = ActualPrisma()
    await ctx.prisma.user.deleteMany();
})

test('Invalid email passed in, should throw PreconditionFailedException', async () => {
    console.log("hello")
})
