import { Context, ActualPrisma } from "../../../context"
import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"
import { userType } from "@prisma/client"
let ctx: Context

let userService: UserService
let Jwt : JwtService

describe("Integration tests of the function updateUserDetails in the UserService", () => {
  beforeEach(async () => {
    userService = new UserService(Jwt)
    ctx = ActualPrisma()
    await ctx.prisma.user.deleteMany()
  })

  test("Invalid emails passed in, should throw NotFoundException", async () => {
    const myUser = {
      userID: "123456",
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      password: process.env.testpassword!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    await ctx.prisma.user.create({
      data: myUser
    })

    let date

    await expect(userService.updateUserDetails("updatedTest", "updatedLast", date, "12345", ctx)).rejects.toThrow("Could not update User")
  })

  test("Valid details passed in, User details should be updated and should reflect update in the database", async () => {
    const myUser = {
      userID: "123456",
      email: process.env.testemail!,
      firstName: "test",
      lastName: "tester",
      password: process.env.testpassword!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    await ctx.prisma.user.create({
      data: myUser
    })

    let date

    await userService.updateUserDetails("updatedTest", "updatedLast", date, "123456", ctx)

    const response = await ctx.prisma.user.findUnique({
      where: {
        email: "test@gmail.com"
      }
    })

    expect(response!.firstName).toBe("updatedTest")
    expect(response!.lastName).toBe("updatedLast")
  })

  test("Valid details passed in, User details should be updated and should reflect update in the database", async () => {
    const updatedDate = new Date("2000-05-30")
    const myUser = {
      userID: "123456",
      email: process.env.testemail!,
      firstName: "test",
      lastName: "tester",
      password: process.env.testpassword!,
      userType: userType.PLANNER,
      dateOfBirth: updatedDate
    }

    await ctx.prisma.user.create({
      data: myUser
    })

    let date

    await userService.updateUserDetails("updatedTest", "updatedLast", date, "123456", ctx)

    const response = await ctx.prisma.user.findUnique({
      where: {
        email: "test@gmail.com"
      }
    })

    expect(response!.firstName).toBe("updatedTest")
    expect(response!.lastName).toBe("updatedLast")
  })
})
