import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"
import { JwtService } from "@nestjs/jwt"
let clientContactService: ClientContactService
let userService: UserService
let Jwt : JwtService
const sgMail = require("@sendgrid/mail")

describe("Unit tests of the function sendMultimediaEmailToContact in client-contact", () => {
  beforeEach(() => {
    Jwt = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRY_TIME }
    })
    userService = new UserService(Jwt)
    clientContactService = new ClientContactService(userService)
  })

  test("Testing empty contact parameters passed into the sendMultimediaEmailToContact in client-contact", async () => {
    let emptyObject
    await expect(clientContactService.sendMultimediaEmailToContact(emptyObject, v4(), v4())).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty plannerID passed into the sendMultimediaEmailToContact in client-contact", async () => {
    const contacts = [
      {
        contactId: v4(),
        contactEmail: "test1@gmail.com",
        name: "name1",
        surname: "surname1",
        plannerID: v4()
      }
    ]
    await expect(clientContactService.sendMultimediaEmailToContact(contacts, "", v4())).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty workoutID passed into the sendMultimediaEmailToContact in client-contact", async () => {
    const contacts = [
      {
        contactId: v4(),
        contactEmail: "test1@gmail.com",
        name: "name1",
        surname: "surname1",
        plannerID: v4()
      }
    ]
    await expect(clientContactService.sendMultimediaEmailToContact(contacts, v4(), "")).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing valid parameters passed into the sendMultimediaEmailToContact in client-contact", async () => {
    const contacts = [
      {
        contactId: v4(),
        contactEmail: "zelutesema@gmail.com",
        name: "name1",
        surname: "surname1",
        plannerID: v4()
      }
    ]

    const workoutID = v4()

    spyOn(sgMail, "send").and.stub()
    spyOn(userService, "findUserByUUID").and.returnValue({
      firstName: "test"
    })
    spyOn(clientContactService, "getFileInBase64").and.returnValue(null)
    expect(await clientContactService.sendMultimediaEmailToContact(contacts, v4(), workoutID)).toBe("Email sent!")
  })
})
