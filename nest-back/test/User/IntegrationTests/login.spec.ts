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
    Jwt=new JwtService({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.EXPIRY_TIME },
    })
    userService=new UserService(Jwt)
    ctx = ActualPrisma()
    await ctx.prisma.user.deleteMany();
})

test('Invalid email passed in, should throw PreconditionFailedException', async () => {

  const theUUID=uuidv4;

    const myUser={
        userId:theUUID,
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        userType: userType.PLANNER,
        dateOfBirth: null
    }

  const response=await userService.login(myUser)


    expect(response.access_token.length).toBe(128);

    expect(typeof response.access_token).toBe("string")
})
