import { Context, ActualPrisma } from "../../../context"
import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"
import { userType } from "@prisma/client"
let ctx: Context

let userService: UserService
let Jwt : JwtService

describe("Integration tests of the function validateUser in the UserService", () => {
  beforeEach(async () => {
    Jwt = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRY_TIME }
    })
    userService = new UserService(Jwt)
    ctx = ActualPrisma()
    await ctx.prisma.user.deleteMany()
  })

  test("Invalid details passed in, should throw not found exception", async () => {
    const myUser = {
      userID: "1234567",
      email: process.env.testemail!,
      firstName: "test",
      lastName: "tester",
      password: process.env.testpassword!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    await userService.signUp(myUser, ctx)

    await ctx.prisma.user.findUnique({
      where: {
        email: process.env.testemail!
      }
    })

    await expect(userService.validateUser("invalid@gmail.com", process.env.testpassword!, ctx)).rejects.toThrow("Invalid Email or Password")
  })

  test("Valid details passed in, User should be validated and User object without password should be returned", async () => {
    const myUser = {
      userID: "1234567",
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      password: process.env.TESTPASSWORD!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    await userService.signUp(myUser, ctx)

    const expectedUser = await ctx.prisma.user.findUnique({
      where: {
        email: "test@gmail.com"
      }
    })

    const finalExpectedUser = {
      userID: expectedUser!.userID,
      email: "test@gmail.com",
      firstName: "test",
      lastName: "tester",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    const response = await userService.validateUser(process.env.testemail!, process.env.testpassword!, ctx)

    expect(response).toStrictEqual(finalExpectedUser)
  })
})
