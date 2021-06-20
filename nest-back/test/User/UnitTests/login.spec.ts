import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

let mockCtx: MockContext
let ctx: Context
let userService: UserService
let Jwt : JwtService
jest.mock('bcrypt');
let bcryptCompare: jest.Mock;

beforeEach(() => {
    Jwt=new JwtService({
        secret:process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.EXPIRY_TIME },
    })
    userService = new UserService(Jwt);
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('Null User passed to signUp, Should throw PreconditionFailedException', async () => {

    let user;
    await expect(userService.login(user)).rejects.toThrow("Invalid User object passed in.")
})


test('Null User passed to signUp, Should throw PreconditionFailedException', async () => {

    spyOn(Jwt,"sign").and.returnValue("signedValue");

    let user={
        name:"hello"
    }


    await expect(userService.login(user)).rejects.toThrow("User object with no userId passed in")
})


test('Null User passed to signUp, Should throw PreconditionFailedException', async () => {

    spyOn(Jwt,"sign").and.returnValue("signedValue");

    let user={
        userId:"hello"
    }

    const signedToken={
        access_token:"signedValue"
    }

    await expect(await userService.login(user)).toStrictEqual(signedToken)
})

