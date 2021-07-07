import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';

let mockCtx: MockContext
let ctx: Context
let userService: UserService
let Jwt : JwtService

describe('Unit tests of the function validateEmail in the UserService', () => {


    beforeEach(() => {
        userService = new UserService(Jwt);
        mockCtx = createMockContext()
        ctx = (mockCtx as unknown) as Context
    })

    test('Empty value passed in for email, should return false', () => {
        let validity = userService.validateEmail("");

        expect(validity).toBe(false);
    })

    test('Null value passed in for email, should return false', () => {
        let email;
        let validity = userService.validateEmail(email);

        expect(validity).toBe(false);
    })

    test('Valid email, should return true (.com)', () => {
        let validity = userService.validateEmail("test@gmail.com");

        expect(validity).toBe(true);
    })

    test('Valid email, should return true (using a -)', () => {
        let validity = userService.validateEmail("test-240@gmail.com");

        expect(validity).toBe(true);
    })

    test('Valid email, should return true (using a symbols)', () => {
        let validity = userService.validateEmail("test-240##@gmail.com");

        expect(validity).toBe(true);
    })

    test('Valid email, should return true (.co.za)', () => {
        let validity = userService.validateEmail("test@gmail.co.za");

        expect(validity).toBe(true);
    })

    test('Valid email, should return true (test.test)', () => {
        let validity = userService.validateEmail("test.test@gmail.com");

        expect(validity).toBe(true);
    })

    test('Valid email, should return true (up.ac.za)', () => {
        let validity = userService.validateEmail("test@gmail.up.ac.za");

        expect(validity).toBe(true);
    })

    test('Valid email, should return true (test.test.test)', () => {
        let validity = userService.validateEmail("test.test.test@gmail.com");

        expect(validity).toBe(true);
    })

    test('Valid email, should return true (test1234)', () => {
        let validity = userService.validateEmail("test1234@gmail.com");

        expect(validity).toBe(true);
    })

    test('Valid email, should return true (@1234)', () => {
        let validity = userService.validateEmail("test@1234.com");

        expect(validity).toBe(true);
    })

    test('Invalid email, no @ sign', () => {
        let validity = userService.validateEmail("test.com");

        expect(validity).toBe(false);
    })

    test('Invalid email, @ followed by .', () => {
        let validity = userService.validateEmail("test@.com");

        expect(validity).toBe(false);
    })

    test('Invalid email, starts with @ symbol.', () => {
        let validity = userService.validateEmail("@hello.com");

        expect(validity).toBe(false);
    })

    test('Invalid email, contains no .', () => {
        let validity = userService.validateEmail("hello@com");

        expect(validity).toBe(false);
    })

    test('Invalid email, . followed by characters', () => {
        let validity = userService.validateEmail("hello@gmail.1234com");

        expect(validity).toBe(false);
    })

    test('Invalid email, domain followed by a .', () => {
        let validity = userService.validateEmail("hello@gmail.com.");

        expect(validity).toBe(false);
    })
})