import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';
import {v4 as uuidv4 } from 'uuid';

import {
    User,
    userType,
    Prisma
} from '@prisma/client';
import {BadRequestException} from "@nestjs/common";


let mockCtx: MockContext
let ctx: Context
let userService: UserService
let Jwt : JwtService

beforeEach(() => {
    userService = new UserService(Jwt);
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('Test, Null values passed into findUserByUUID', async () => {

    const userUUID=uuidv4();
    const secondUUID=uuidv4();
    const myUser={
        userId:uuidv4,
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword",
        userType: userType.PLANNER,
        dateOfBirth: null
    }

    mockCtx.prisma.user.findUnique.mockResolvedValue(myUser)

    // const response=await userService.findUserByUUID("",ctx)

    expect(async () => await userService.findUserByUUID("",ctx)).toThrow(BadRequestException);

})

test('Test, Valid user returned by mock prisma service', async () => {

    const userUUID=uuidv4();
    const secondUUID=uuidv4();
    const myUser={
        userId:uuidv4,
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword",
        userType: userType.PLANNER,
        dateOfBirth: null
    }

    mockCtx.prisma.user.findUnique.mockResolvedValue(myUser)

    const response=await userService.findUserByUUID(userUUID,ctx)

    expect(response).toBe(myUser);
})


