import { Context, ActualPrisma } from "../../../context"
import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"
import { v4 as uuidv4 } from "uuid"

import { userType } from "@prisma/client"
let ctx: Context

let userService: UserService
let Jwt : JwtService

describe("Integration tests of the function signUp in the UserService", () => {
  beforeEach(async () => {
    Jwt = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRY_TIME }
    })
    userService = new UserService(Jwt)
    ctx = ActualPrisma()
    await ctx.prisma.user.deleteMany()
  })

  test("Invalid email passed in, should throw PreconditionFailedException", async () => {
    const userUUID = uuidv4()

    const myUser = {
      userID: userUUID,
      email: "testgmail.com",
      firstName: "test",
      lastName: "tester",
      password: process.env.TESTPASSWORD!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid email address")
  })

  test("Invalid email passed in, should throw PreconditionFailedException", async () => {
    const userUUID = uuidv4()

    const myUser = {
      userID: userUUID,
      email: "test@@gmail.com",
      firstName: "test",
      lastName: "tester",
      password: process.env.TESTPASSWORD!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid email address")
  })

  test("Invalid email passed in, should throw PreconditionFailedException", async () => {
    const userUUID = uuidv4()

    const myUser = {
      userID: userUUID,
      email: "test@@gmail.com",
      firstName: "test",
      lastName: "tester",
      password: process.env.TESTPASSWORD!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid email address")
  })

  test("Invalid email passed in, should throw PreconditionFailedException", async () => {
    const userUUID = uuidv4()

    const myUser = {
      userID: userUUID,
      email: "test@gmail..com",
      firstName: "test",
      lastName: "tester",
      password: process.env.TESTPASSWORD!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid email address")
  })

  test("Invalid password passed in, should throw PreconditionFailedException", async () => {
    const userUUID = uuidv4()

    const myUser = {
      userID: userUUID,
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      password: "thePassword",
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid password")
  })

  test("Invalid password without symbol passed in, should throw PreconditionFailedException", async () => {
    const userUUID = uuidv4()

    const myUser = {
      userID: userUUID,
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      password: "thePassword500",
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid password")
  })

  test("Invalid password passed in no capitals, should throw PreconditionFailedException", async () => {
    const userUUID = uuidv4()

    const myUser = {
      userID: userUUID,
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      password: "thepassword2000#",
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid password")
  })

  test("Invalid password passed (No lower case) in, should throw PreconditionFailedException", async () => {
    const userUUID = uuidv4()

    const myUser = {
      userID: userUUID,
      email: process.env.testemail!,
      firstName: "test",
      lastName: "tester",
      password: "THEPASSWORD2000",
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    await expect(userService.signUp(myUser, ctx)).rejects.toThrow("Invalid password")
  })

  test("Valid details passed in, should create an entry of a User with details in the database.", async () => {
    const myUser = {
      userID: "",
      email: process.env.testemail!,
      firstName: "test",
      lastName: "tester",
      password: process.env.testpassword!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    const response = await userService.signUp(myUser, ctx)

    const dbUser = await ctx.prisma.user.findUnique({
      where: {
        email: "test@gmail.com"
      }
    })

    expect(dbUser).toBeDefined()
    expect(response.access_token.length).toBe(192)
    expect(typeof response.access_token).toBe("string")
  })
})
