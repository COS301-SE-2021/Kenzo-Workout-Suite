import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {userType} from "@prisma/client";
import {v4 as uuidv4 } from 'uuid';

let userService: UserService
let Jwt : JwtService

beforeEach(() => {
    userService = new UserService(Jwt);
})

test('Null request passed into googleLogin function ',  async () => {
     await expect(userService.googleLogin(null)).rejects.toThrow("No such google User")
})

test('Request passed into googleLogin function without User object ',  async () => {

    let request={
    }
    await expect(userService.googleLogin(null)).rejects.toThrow("No such google User")
})


test('Valid response ',  async () => {

    let request={
        user: "theUser"
    }
    let expected_response={
        message: 'User information from google',
        user: "theUser"
    }
    await expect( await userService.googleLogin(request)).toStrictEqual(expected_response)
})

