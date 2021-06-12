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

test('Valid email, should return true (.com)', async () => {
    let validity=userService.validateEmail("test@gmail.com");

    expect(validity).toBe(true);
})

test('Valid email, should return true (using a -)', async () => {
    let validity=userService.validateEmail("test-240@gmail.com");

    expect(validity).toBe(true);
})

test('Valid email, should return true (using a symbols)', async () => {
    let validity=userService.validateEmail("test-240##@gmail.com");

    expect(validity).toBe(true);
})

test('Valid email, should return true (.co.za)', async () => {
    let validity=userService.validateEmail("test@gmail.co.za");

    expect(validity).toBe(true);
})

test('Valid email, should return true (test.test)', async () => {
    let validity=userService.validateEmail("test.test@gmail.com");

    expect(validity).toBe(true);
})

test('Valid email, should return true (up.ac.za)', async () => {
    let validity=userService.validateEmail("test@gmail.up.ac.za");

    expect(validity).toBe(true);
})

test('Valid email, should return true (test.test.test)', async () => {
    let validity=userService.validateEmail("test.test.test@gmail.com");

    expect(validity).toBe(true);
})

test('Valid email, should return true (test1234)', async () => {
    let validity=userService.validateEmail("test1234@gmail.com");

    expect(validity).toBe(true);
})

test('Valid email, should return true (@1234)', async () => {
    let validity=userService.validateEmail("test@1234.com");

    expect(validity).toBe(true);
})

test('Invalid email, no @ sign', async () => {
    let validity=userService.validateEmail("test.com");

    expect(validity).toBe(false);
})

test('Invalid email, @ followed by .', async () => {
    let validity=userService.validateEmail("test@.com");

    expect(validity).toBe(false);
})

test('Invalid email, starts with @ symbol.', async () => {
    let validity=userService.validateEmail("@hello.com");

    expect(validity).toBe(false);
})

test('Invalid email, contains no .', async () => {
    let validity=userService.validateEmail("hello@com");

    expect(validity).toBe(false);
})

test('Invalid email, . followed by characters', async () => {
    let validity=userService.validateEmail("hello@gmail.1234com");

    expect(validity).toBe(false);
})

test('Invalid email, domain followed by a .', async () => {
    let validity=userService.validateEmail("hello@gmail.com.");

    expect(validity).toBe(false);
})