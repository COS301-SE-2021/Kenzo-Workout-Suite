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
jest.mock("bcrypt")
let bcryptCompare: jest.Mock

describe("Unit tests of the function validateUser in the UserService", () => {
  beforeEach(() => {
    userService = new UserService(Jwt)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Null username passed in, should throw NotFoundException", async () => {
    await expect(userService.validateUser("", "password", ctx)).rejects.toThrow("Invalid Email or Password")
  })

  test("Null password passed in, should throw NotFoundException", async () => {
    await expect(userService.validateUser("username", "", ctx)).rejects.toThrow("Invalid Email or Password")
  })

  test("Null User returned by mock Prisma client, should throw NotFoundException", async () => {
    bcryptCompare = jest.fn().mockReturnValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare
    mockCtx.prisma.user.findUnique.mockResolvedValue(null)

    await expect(userService.validateUser("hello", "password", ctx)).rejects.toThrow("Invalid Email or Password")
  })

  test("Bcrypt.compare returns false, should throw NotFoundException", async () => {
    bcryptCompare = jest.fn().mockReturnValue(false);
    (bcrypt.compare as jest.Mock) = bcryptCompare

    const myUser = {
      userID: uuidv4(),
      email: "test@gmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    mockCtx.prisma.user.findUnique.mockResolvedValue(myUser)

    await expect(userService.validateUser("hello", "password", ctx)).rejects.toThrow("Invalid Email or Password")
  })

  test("Bcrypt.compare returns true, should return User details WITHOUT PASSWORD", async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare

    const userUUID = uuidv4()

    const myUser = {
      userID: userUUID,
      email: "test@gmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    const expectedResponse = {
      userID: userUUID,
      email: "test@gmail.com",
      firstName: "test",
      lastName: "tester",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    mockCtx.prisma.user.findUnique.mockResolvedValue(myUser)

    const response = await userService.validateUser("hello", "password", ctx)

    expect(response).toStrictEqual(expectedResponse)
  })
})
