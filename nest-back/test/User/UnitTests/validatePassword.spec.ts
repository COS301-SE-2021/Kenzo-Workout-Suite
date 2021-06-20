import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';

let mockCtx: MockContext
let ctx: Context
let userService: UserService
let Jwt : JwtService

describe('Unit tests of the function validatePassword in the UserService', () => {


    beforeEach(() => {
        userService = new UserService(Jwt);
        mockCtx = createMockContext()
        ctx = (mockCtx as unknown) as Context
    })

    test('Empty value passed into password, should return false', () => {
        let validity = userService.validatePassword("");

        expect(validity).toBe(false);
    })

    test('Null value passed into password, should return false', () => {
        let password;
        let validity = userService.validatePassword(password);

        expect(validity).toBe(false);
    })

    test('Valid password, should return true', () => {
        let validity = userService.validatePassword("Test2000#");

        expect(validity).toBe(true);
    })

    test('Invalid password, should return false (missing symbol)', () => {
        let validity = userService.validatePassword("Test2000");

        expect(validity).toBe(false);
    })

    test('Invalid password, should return false (missing number)', () => {
        let validity = userService.validatePassword("TestTest#");

        expect(validity).toBe(false);
    })

    test('Invalid password, should return false (missing capital letter)', () => {
        let validity = userService.validatePassword("test2000#");

        expect(validity).toBe(false);
    })

    test('Invalid password, should return false (missing lower case character)', () => {
        let validity = userService.validatePassword("TEST2000#");

        expect(validity).toBe(false);
    })

    test('Invalid password, should return false (Password too short)', () => {
        let validity = userService.validatePassword("Test2#");

        expect(validity).toBe(false);
    })
})