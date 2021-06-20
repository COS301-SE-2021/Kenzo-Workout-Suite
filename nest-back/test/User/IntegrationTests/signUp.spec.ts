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

    let userUUID=uuidv4();

    const myUser={
        userId:userUUID,
        email: "testgmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword",
        userType: userType.PLANNER,
        dateOfBirth: null
    }
    await expect(userService.signUp(myUser,ctx)).rejects.toThrow("Invalid email address")
})

test('Invalid email passed in, should throw PreconditionFailedException', async () => {

    let userUUID=uuidv4();

    const myUser={
        userId:userUUID,
        email: "test@@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword",
        userType: userType.PLANNER,
        dateOfBirth: null
    }
    await expect(userService.signUp(myUser,ctx)).rejects.toThrow("Invalid email address")
})

test('Invalid email passed in, should throw PreconditionFailedException', async () => {

    let userUUID=uuidv4();

    const myUser={
        userId:userUUID,
        email: "test@@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword",
        userType: userType.PLANNER,
        dateOfBirth: null
    }
    await expect(userService.signUp(myUser,ctx)).rejects.toThrow("Invalid email address")
})

test('Invalid email passed in, should throw PreconditionFailedException', async () => {

    let userUUID=uuidv4();

    const myUser={
        userId:userUUID,
        email: "test@@gmail..com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword",
        userType: userType.PLANNER,
        dateOfBirth: null
    }
    await expect(userService.signUp(myUser,ctx)).rejects.toThrow("Invalid email address")
})

test('Invalid email passed in, should throw PreconditionFailedException', async () => {

    let userUUID=uuidv4();

    const myUser={
        userId:userUUID,
        email: "test@gmail..com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword",
        userType: userType.PLANNER,
        dateOfBirth: null
    }
    await expect(userService.signUp(myUser,ctx)).rejects.toThrow("Invalid email address")
})


test('Invalid password passed in, should throw PreconditionFailedException', async () => {

    let userUUID=uuidv4();

    const myUser={
        userId:userUUID,
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword",
        userType: userType.PLANNER,
        dateOfBirth: null
    }
    await expect(userService.signUp(myUser,ctx)).rejects.toThrow("Invalid password")
})

test('Invalid password passed in, should throw PreconditionFailedException', async () => {

    let userUUID=uuidv4();

    const myUser={
        userId:userUUID,
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword2000",
        userType: userType.PLANNER,
        dateOfBirth: null
    }
    await expect(userService.signUp(myUser,ctx)).rejects.toThrow("Invalid password")
})

test('Invalid password passed in, should throw PreconditionFailedException', async () => {

    let userUUID=uuidv4();

    const myUser={
        userId:userUUID,
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thepassword2000",
        userType: userType.PLANNER,
        dateOfBirth: null
    }
    await expect(userService.signUp(myUser,ctx)).rejects.toThrow("Invalid password")
})

test('Invalid password passed in, should throw PreconditionFailedException', async () => {

    let userUUID=uuidv4();

    const myUser={
        userId:userUUID,
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"THEPASSWORD2000",
        userType: userType.PLANNER,
        dateOfBirth: null
    }
    await expect(userService.signUp(myUser,ctx)).rejects.toThrow("Invalid password")
})

test('Valid details passed in, should create an entry of a User with details in the database.', async () => {

    let userUUID=uuidv4();

    const myUser={
        userId:"",
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"thePassword2000#",
        userType: userType.PLANNER,
        dateOfBirth: null
    }

    const response=await userService.signUp(myUser,ctx);

    const dbUser=await ctx.prisma.user.findUnique({
        where: {
            email: "test@gmail.com"
        },
    });

    expect(dbUser).toBeDefined()
    expect(response.access_token.length).toBe(192)
    expect(typeof response.access_token).toBe("string")
})
