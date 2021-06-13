import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {userType} from "@prisma/client";
import {v4 as uuidv4 } from 'uuid';

let userService: UserService
let Jwt : JwtService

beforeEach(() => {
})

test('Null request passed into googleLogin function ', async () => {
    expect(userService.googleLogin(null)).toBe("No user from google")
})

test('Null request passed into googleLogin function ', async () => {

    let request={
        user: "theUser"
    }
    let expected_response={
        message: 'User information from google',
        user: "theUser"
    }
    expect(userService.googleLogin(request)).toStrictEqual(expected_response)
})

test('Request passed into googleLogin function without user object ', async () => {

    let request={
    }
    expect(userService.googleLogin(null)).toBe("No user from google")
})
