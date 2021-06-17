import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';

let mockCtx: MockContext
let ctx: Context
let userService: UserService
let Jwt : JwtService

beforeEach(() => {
    userService = new UserService(Jwt);
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('Valid password, should return true', async () => {
    let validity=userService.validatePassword("Test2000#");

    expect(validity).toBe(true);
})

test('Invalid password, should return false (missing symbol)', async () => {
    let validity=userService.validatePassword("Test2000");

    expect(validity).toBe(false);
})

test('Invalid password, should return false (missing number)', async () => {
    let validity=userService.validatePassword("TestTest#");

    expect(validity).toBe(false);
})

test('Invalid password, should return false (missing capital letter)', async () => {
    let validity=userService.validatePassword("test2000#");

    expect(validity).toBe(false);
})

test('Invalid password, should return false (missing lower case character)', async () => {
    let validity=userService.validatePassword("TEST2000#");

    expect(validity).toBe(false);
})

test('Invalid password, should return false (Password too short)', async () => {
    let validity=userService.validatePassword("Test2#");

    expect(validity).toBe(false);
})
