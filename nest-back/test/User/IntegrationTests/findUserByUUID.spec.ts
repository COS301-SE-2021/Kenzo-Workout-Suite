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
    userService = new UserService(Jwt);
    ctx = ActualPrisma()
    await ctx.prisma.user.deleteMany();
})

test('Test, Valid user returned by mock prisma service', async () => {

    const userUUID=uuidv4();
    const secondUUID=uuidv4();
    const myUser={
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"Test2000#",
        userType: userType.PLANNER,
        dateOfBirth: null
    }

    const createdUser =await ctx.prisma.user.create({
        data:{
            email: "test@gmail.com",
            firstName: "test",
            lastName: "tester",
            password:"Test2000#",
            userType: userType.PLANNER,
            dateOfBirth: null
        }
    })

    // When a planner exists, the details should be fine

    const searchUUID=createdUser.userId;

    const response=await userService.findUserByUUID(searchUUID,ctx)

    expect(response).toStrictEqual(createdUser);
})

