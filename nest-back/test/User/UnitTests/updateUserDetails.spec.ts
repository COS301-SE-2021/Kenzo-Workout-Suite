import { MockContext, Context, createMockContext } from "../../../context";
import {UserService} from "../../../src/User/user.service";
import { JwtService } from '@nestjs/jwt';
import {v4 as uuidv4 } from 'uuid';

import {
    User,
    userType,
    Prisma
} from '@prisma/client';
import {BadRequestException} from "@nestjs/common";


let mockCtx: MockContext
let ctx: Context
let userService: UserService
let Jwt : JwtService

describe('Unit tests of the function updateUserDetails in the UserService', () => {


    beforeEach(() => {
        userService = new UserService(Jwt);
        mockCtx = createMockContext()
        ctx = (mockCtx as unknown) as Context
    })

    test('Test, Null values passed into updateUserDetails should throw BadRequestException', async () => {

        const userUUID = uuidv4();
        const myUser = {
            userId: userUUID,
            email: "test@gmail.com",
            firstName: "test",
            lastName: "tester",
            password: "thePassword",
            userType: userType.PLANNER,
            dateOfBirth: null
        }
        mockCtx.prisma.user.update.mockResolvedValue(myUser)

        await expect(userService.updateUserDetails("", "updatedLastName", new Date("2000-05-30"), userUUID, ctx)).rejects.toThrow("Null values can not be passed in for firstName, lastName or userId")
    })

    test('Test, Null last name passed into updateUserDetails, should throw BadRequestException', async () => {

        const userUUID = uuidv4();
        const myUser = {
            userId: userUUID,
            email: "test@gmail.com",
            firstName: "test",
            lastName: "tester",
            password: "thePassword",
            userType: userType.PLANNER,
            dateOfBirth: null
        }
        mockCtx.prisma.user.update.mockResolvedValue(myUser)

        await expect(userService.updateUserDetails("updatedFirstName", "", new Date("2000-05-30"), userUUID, ctx)).rejects.toThrow("Null values can not be passed in for firstName, lastName or userId")
    })

    test('Test, Null first name passed into updateUserDetails, should throw bad request exception', async () => {

        const userUUID = uuidv4();
        const myUser = {
            userId: userUUID,
            email: "test@gmail.com",
            firstName: "test",
            lastName: "tester",
            password: "thePassword",
            userType: userType.PLANNER,
            dateOfBirth: null
        }
        mockCtx.prisma.user.update.mockResolvedValue(myUser)

        let nullFirstName;

        await expect(userService.updateUserDetails(nullFirstName, "updatedLastName", new Date("2000-05-30"), userUUID, ctx)).rejects.toThrow("Null values can not be passed in for firstName, lastName or userId")
    })

    test('Test, Null last name passed into updateUserDetails, should throw bad request exception', async () => {

        const userUUID = uuidv4();
        const myUser = {
            userId: userUUID,
            email: "test@gmail.com",
            firstName: "test",
            lastName: "tester",
            password: "thePassword",
            userType: userType.PLANNER,
            dateOfBirth: null
        }
        mockCtx.prisma.user.update.mockResolvedValue(myUser)

        let nullLastName;

        await expect(userService.updateUserDetails("updatedFirstName", nullLastName, new Date("2000-05-30"), userUUID, ctx)).rejects.toThrow("Null values can not be passed in for firstName, lastName or userId")
    })

    test('Test, Null last name passed into updateUserDetails, should throw BadRequestException', async () => {

        const userUUID = uuidv4();
        const myUser = {
            userId: userUUID,
            email: "test@gmail.com",
            firstName: "test",
            lastName: "tester",
            password: "thePassword",
            userType: userType.PLANNER,
            dateOfBirth: null
        }
        mockCtx.prisma.user.update.mockResolvedValue(myUser)

        let nullLastName;

        await expect(userService.updateUserDetails("updatedFirstName", nullLastName, new Date("2000-05-30"), "", ctx)).rejects.toThrow("Null values can not be passed in for firstName, lastName or userId")
    })

    test('Test, Null userID passed into updateUserDetails function, should throw BadRequestException', async () => {

        const userUUID = uuidv4();
        const myUser = {
            userId: userUUID,
            email: "test@gmail.com",
            firstName: "test",
            lastName: "tester",
            password: "thePassword",
            userType: userType.PLANNER,
            dateOfBirth: null
        }
        mockCtx.prisma.user.update.mockResolvedValue(myUser)

        let nullUserId;

        await expect(userService.updateUserDetails("updatedFirstName", "updatedLastName", new Date("2000-05-30"), nullUserId, ctx)).rejects.toThrow("Null values can not be passed in for firstName, lastName or userId")
    })


    test('Test, Valid values passed into updateUserDetails, should return confirmation message.', async () => {

        const userUUID = uuidv4();
        const myUser = {
            userId: userUUID,
            email: "test@gmail.com",
            firstName: "test",
            lastName: "tester",
            password: "thePassword",
            userType: userType.PLANNER,
            dateOfBirth: null
        }

        mockCtx.prisma.user.update.mockResolvedValue(myUser)

        const expectedMessage = {
            message: 'User data updated'
        }
        await expect(await userService.updateUserDetails("updatedFirstName", "updatedLastName", new Date("2000-05-30"), userUUID, ctx)).toStrictEqual(expectedMessage)
    })
})