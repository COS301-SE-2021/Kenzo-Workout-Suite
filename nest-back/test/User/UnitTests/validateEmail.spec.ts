import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"

let userService: UserService
let Jwt : JwtService

describe("Unit tests of the function validateEmail in the UserService", () => {
  beforeEach(() => {
    userService = new UserService(Jwt)
  })

  test("Empty value passed in for email, should return false", () => {
    const validity = userService.validateEmail("")

    expect(validity).toBe(false)
  })

  test("Null value passed in for email, should return false", () => {
    let email
    const validity = userService.validateEmail(email)

    expect(validity).toBe(false)
  })

  test("Valid email, should return true (.com)", () => {
    const validity = userService.validateEmail("test@gmail.com")

    expect(validity).toBe(true)
  })

  test("Valid email, should return true (using a -)", () => {
    const validity = userService.validateEmail("test-240@gmail.com")

    expect(validity).toBe(true)
  })

  test("Valid email, should return true (using a symbols)", () => {
    const validity = userService.validateEmail("test-240##@gmail.com")

    expect(validity).toBe(true)
  })

  test("Valid email, should return true (.co.za)", () => {
    const validity = userService.validateEmail("test@gmail.co.za")

    expect(validity).toBe(true)
  })

  test("Valid email, should return true (test.test)", () => {
    const validity = userService.validateEmail("test.test@gmail.com")

    expect(validity).toBe(true)
  })

  test("Valid email, should return true (up.ac.za)", () => {
    const validity = userService.validateEmail("test@gmail.up.ac.za")

    expect(validity).toBe(true)
  })

  test("Valid email, should return true (test.test.test)", () => {
    const validity = userService.validateEmail("test.test.test@gmail.com")

    expect(validity).toBe(true)
  })

  test("Valid email, should return true (test1234)", () => {
    const validity = userService.validateEmail("test1234@gmail.com")

    expect(validity).toBe(true)
  })

  test("Valid email, should return true (@1234)", () => {
    const validity = userService.validateEmail("test@1234.com")

    expect(validity).toBe(true)
  })

  test("Invalid email, no @ sign", () => {
    const validity = userService.validateEmail("test.com")

    expect(validity).toBe(false)
  })

  test("Invalid email, @ followed by .", () => {
    const validity = userService.validateEmail("test@.com")

    expect(validity).toBe(false)
  })

  test("Invalid email, starts with @ symbol.", () => {
    const validity = userService.validateEmail("@hello.com")

    expect(validity).toBe(false)
  })

  test("Invalid email, contains no .", () => {
    const validity = userService.validateEmail("hello@com")

    expect(validity).toBe(false)
  })

  test("Invalid email, . followed by characters", () => {
    const validity = userService.validateEmail("hello@gmail.1234com")

    expect(validity).toBe(false)
  })

  test("Invalid email, domain followed by a .", () => {
    const validity = userService.validateEmail("hello@gmail.com.")

    expect(validity).toBe(false)
  })
})
