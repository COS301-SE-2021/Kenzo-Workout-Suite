import { Context, ActualPrisma } from "../../../context"
import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"
import { v4 as uuidv4 } from "uuid"

import {
  userType
} from "@prisma/client"

describe("Integration tests of the function findUserByUUID in the UserService", () => {
  let ctx: Context
  let userService: UserService
  let Jwt : JwtService

  beforeEach(async () => {
    userService = new UserService(Jwt)
    ctx = ActualPrisma()
    await ctx.prisma.user.deleteMany()
  })

  test("Test, Valid User returned by mock prisma service", async () => {
    const createdUser = await ctx.prisma.user.create({
      data: {
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password: "Test2000#",
        userType: userType.PLANNER,
        dateOfBirth: null
      }
    })

    // When a planner exists, the details should be fine

    const searchUUID = createdUser.userID

    const expectedUser = {
      email: "test@gmail.com",
      firstName: "test",
      lastName: "tester",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    const response = await userService.findUserByUUID(searchUUID, ctx)

    expect(response).toStrictEqual(expectedUser)
  })

  test("User that is not in the database is attempted to be updated, should throw preconditionfailed exception", async () => {
    const userId = uuidv4()
    await expect(userService.findUserByUUID(userId, ctx)).rejects.toThrow("No User with such UUID")
  })
})
