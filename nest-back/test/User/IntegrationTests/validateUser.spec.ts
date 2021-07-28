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
      email: "test@gmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword2000#",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    await userService.signUp(myUser, ctx)

    await ctx.prisma.user.findUnique({
      where: {
        email: "test@gmail.com"
      }
    })

    await expect(userService.validateUser("invalid@gmail.com", "thePassword2000#", ctx)).rejects.toThrow("Invalid Email or Password")
  })

  test("Valid details passed in, User should be validated and User object without password should be returned", async () => {
    const myUser = {
      userID: "1234567",
      email: "test@gmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword2000#",
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

    const response = await userService.validateUser("test@gmail.com", "thePassword2000#", ctx)

    expect(response).toStrictEqual(finalExpectedUser)
  })
})
