import { MockContext, Context, createMockContext } from "../../../context"
import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"
let userService: UserService
let Jwt : JwtService

describe("Unit tests of the function validatePassword in the UserService", () => {
  beforeEach(() => {
    userService = new UserService(Jwt)
  })

  test("Empty value passed into password, should return false", () => {
    const validity = userService.validatePassword("")

    expect(validity).toBe(false)
  })

  test("Null value passed into password, should return false", () => {
    let password
    const validity = userService.validatePassword(password)

    expect(validity).toBe(false)
  })

  test("Valid password, should return true", () => {
    const validity = userService.validatePassword("Test2000#")

    expect(validity).toBe(true)
  })

  test("Invalid password, should return false (missing symbol)", () => {
    const validity = userService.validatePassword("Test2000")

    expect(validity).toBe(false)
  })

  test("Invalid password, should return false (missing number)", () => {
    const validity = userService.validatePassword("TestTest#")

    expect(validity).toBe(false)
  })

  test("Invalid password, should return false (missing capital letter)", () => {
    const validity = userService.validatePassword("test2000#")

    expect(validity).toBe(false)
  })

  test("Invalid password, should return false (missing lower case character)", () => {
    const validity = userService.validatePassword("TEST2000#")

    expect(validity).toBe(false)
  })

  test("Invalid password, should return false (Password too short)", () => {
    const validity = userService.validatePassword("Test2#")

    expect(validity).toBe(false)
  })
})
