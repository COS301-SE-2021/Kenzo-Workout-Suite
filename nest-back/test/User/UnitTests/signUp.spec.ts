import { MockContext, Context, createMockContext } from "../../../context"
import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { userType } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

let mockCtx: MockContext
let ctx: Context

let userService: UserService

let Jwt : JwtService
jest.mock("@nestjs/jwt")
let bcryptCompare: jest.Mock

describe("Unit tests of the function signUp in the UserService", () => {
  beforeEach(() => {
    userService = new UserService(Jwt)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Null User passed to signUp, Should throw PreconditionFailedException", async () => {
    let myUser

    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid User object")
  })

  test("signUp with invalid email, validate email returns fault, therefore PreconditionFailedException.", async () => {
    const userUUID = uuidv4()
    const myUser = {
      userID: userUUID,
      email: "testgmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    spyOn(userService, "validateEmail").and.returnValue(false)

    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid email address")
  })

  test("signUp validateEmail return true and validatePassword returns false, therefore preconditionFailedException should be thrown", async () => {
    const userUUID = uuidv4()
    const myUser = {
      userID: userUUID,
      email: "testgmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword",
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    spyOn(userService, "validateEmail").and.returnValue(true)
    spyOn(userService, "validatePassword").and.returnValue(false)

    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid password")
  })

  test("Valid email and password, prisma count returns 1 therefore should throw BadRequestException ", async () => {
    const userUUID = uuidv4()
    const myUser = {
      userID: userUUID,
      email: "testgmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    bcryptCompare = jest.fn().mockReturnValue("thePasswordAfterHashing");
    (bcrypt.hash as jest.Mock) = bcryptCompare

    spyOn(userService, "validateEmail").and.returnValue(true)
    spyOn(userService, "validatePassword").and.returnValue(true)

    mockCtx.prisma.user.count.mockResolvedValue(1)

    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("User with this email already exists")
  })

  test("Valid details, prisma returns null therefore should throw BadRequest exception", async () => {
    const userUUID = uuidv4()
    const myUser = {
      userID: userUUID,
      email: "testgmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    let nullUser

    bcryptCompare = jest.fn().mockReturnValue("thePasswordAfterHashing");
    (bcrypt.hash as jest.Mock) = bcryptCompare

    spyOn(userService, "validateEmail").and.returnValue(true)
    spyOn(userService, "validatePassword").and.returnValue(true)

    mockCtx.prisma.user.count.mockResolvedValue(0)
    mockCtx.prisma.user.create.mockResolvedValue(nullUser)

    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Could not create User")
  })

  test("Valid details passed in, sign up should succeed and valid response message should be returned", async () => {
    const userUUID = uuidv4()
    const myUser = {
      userID: userUUID,
      email: "testgmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    bcryptCompare = jest.fn().mockReturnValue("thePasswordAfterHashing");
    (bcrypt.hash as jest.Mock) = bcryptCompare

    spyOn(userService, "validateEmail").and.returnValue(true)
    spyOn(userService, "validatePassword").and.returnValue(true)
    spyOn(userService, "login").and.returnValue("Logged in User")

    mockCtx.prisma.user.count.mockResolvedValue(0)
    mockCtx.prisma.user.create.mockResolvedValue(myUser)

    expect(await userService.signUp(myUser, ctx)).toBe("Logged in User")
  })
})
