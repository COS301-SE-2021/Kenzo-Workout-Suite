import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {userType} from "@prisma/client";
import {v4 as uuidv4 } from 'uuid';

let mockCtx: MockContext
let ctx: Context
let userService: UserService
let Jwt : JwtService
jest.mock('bcrypt');
let bcryptCompare: jest.Mock;

beforeEach(() => {
    userService = new UserService(Jwt);
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('Null user passed to signUp, Should throw PreconditionFailedException', async () => {

    spyOn(Jwt,"sign").and.returnValue("RHEAREAJH");

    let user={
        name:"hello"
    }

    console.log(userService.login(user));
})


