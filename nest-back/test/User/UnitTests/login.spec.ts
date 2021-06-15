import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {jwtConstants} from "../../../src/user/constants";

let mockCtx: MockContext
let ctx: Context
let userService: UserService
let Jwt : JwtService
jest.mock('bcrypt');
let bcryptCompare: jest.Mock;

beforeEach(() => {
    Jwt=new JwtService({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
    })
    userService = new UserService(Jwt);
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('Null user passed to signUp, Should throw PreconditionFailedException', async () => {

    let user;
    await expect(userService.login(user)).rejects.toThrow("Invalid user object passed in.")
})


test('Null user passed to signUp, Should throw PreconditionFailedException', async () => {

    spyOn(Jwt,"sign").and.returnValue("signedValue");

    let user={
        name:"hello"
    }


    await expect(userService.login(user)).rejects.toThrow("User object with no userId passed in")
})


test('Null user passed to signUp, Should throw PreconditionFailedException', async () => {

    spyOn(Jwt,"sign").and.returnValue("signedValue");

    let user={
        userId:"hello"
    }

    const signedToken={
        access_token:"signedValue"
    }

    await expect(await userService.login(user)).toStrictEqual(signedToken)
})

