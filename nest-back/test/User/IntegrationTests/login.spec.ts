import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"
import { v4 as uuidv4 } from "uuid"

import { userType } from "@prisma/client"

let userService: UserService
let Jwt : JwtService

describe("Integration tests of the function login in the UserService", () => {
  beforeEach(async () => {
    Jwt = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRY_TIME }
    })
    userService = new UserService(Jwt)
  })

  test("Valid details passed into login, should return access token of length 128", async () => {
    const theUUID = uuidv4

    const myUser = {
      userID: theUUID,
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    const response = await userService.login(myUser)

    expect(response.access_token.length).toBe(128)

    expect(typeof response.access_token).toBe("string")
  })
})
