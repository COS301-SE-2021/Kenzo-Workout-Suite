import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"
import { JwtService } from "@nestjs/jwt"
import { ActualPrisma } from "../../../context"
let clientContactService: ClientContactService
let userService: UserService
let Jwt : JwtService
const sgMail = require("@sendgrid/mail")
const ctx = ActualPrisma()

describe("Integration tests of the function sendVideoEmail in client-contact", () => {
  beforeEach(async () => {
    Jwt = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRY_TIME }
    })
    userService = new UserService(Jwt)
    clientContactService = new ClientContactService(userService)
    await ctx.prisma.user.deleteMany()
  })

  test("Testing valid parameters passed into the sendVideoEmail in client-contact", async () => {
    const contacts = [
      {
        contactId: v4(),
        contactEmail: "zelutesema@gmail.com",
        name: "name1",
        surname: "surname1",
        plannerID: v4()
      }
    ]

    const theUser = await ctx.prisma.user.create({
      data: {
        firstName: "tester",
        lastName: "test",
        userType: "PLANNER",
        email: "test@gmail.com",
        password: "Zelu2000#"
      }
    })

    spyOn(sgMail, "send").and.stub()
    spyOn(clientContactService, "getFileInBase64").and.returnValue(null)
    expect(await clientContactService.sendVideoEmailToContact(contacts, theUser.userID, v4())).toBe("Email sent!")
  })
})
