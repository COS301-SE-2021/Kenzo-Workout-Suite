import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"
let userService: UserService
let Jwt : JwtService

describe("Unit tests of the function googleLogin in the UserService", () => {
  beforeEach(() => {
    userService = new UserService(Jwt)
  })

  test("Null request passed into googleLogin function ", async () => {
    await expect(userService.googleLogin(null)).rejects.toThrow("No such google User")
  })

  test("Request passed into googleLogin function without User object ", async () => {
    await expect(userService.googleLogin(null)).rejects.toThrow("No such google User")
  })

  test("Valid response ", async () => {
    const request = {
      user: "theUser"
    }
    const expectedResponse = {
      message: "User information from google",
      user: "theUser"
    }
    await expect(await userService.googleLogin(request)).toStrictEqual(expectedResponse)
  })
})
