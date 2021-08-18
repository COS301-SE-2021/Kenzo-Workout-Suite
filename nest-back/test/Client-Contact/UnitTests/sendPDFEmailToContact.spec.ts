import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"
let clientContactService: ClientContactService
let userService: UserService

describe("Unit tests of the function sendPDFEmailToContact in client-contact", () => {
  beforeEach(() => {
    clientContactService = new ClientContactService(userService)
  })

  test("Testing empty contact parameters passed into the sendPDFEmailToContact in client-contact", async () => {
    let emptyObject
    await expect(clientContactService.sendPDFEmailToContact(emptyObject, v4(), v4())).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty plannerID passed into the sendPDFEmailToContact in client-contact", async () => {
    const contacts = [
      {
        contactId: v4(),
        contactEmail: "test1@gmail.com",
        name: "name1",
        surname: "surname1",
        plannerID: v4()
      }
    ]
    await expect(clientContactService.sendPDFEmailToContact(contacts, "", v4())).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty workoutID passed into the sendPDFEmailToContact in client-contact", async () => {
    const contacts = [
      {
        contactId: v4(),
        contactEmail: "test1@gmail.com",
        name: "name1",
        surname: "surname1",
        plannerID: v4()
      }
    ]
    await expect(clientContactService.sendPDFEmailToContact(contacts, v4(), "")).rejects.toThrow("Parameters can not be left empty")
  })
})
