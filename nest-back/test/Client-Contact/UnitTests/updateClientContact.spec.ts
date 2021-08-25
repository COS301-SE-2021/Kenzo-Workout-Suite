import { MockContext, createMockContext } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"
import { BadRequestException } from "@nestjs/common"

let mockCtx: MockContext
let clientContactService: ClientContactService
let userService: UserService

describe("Unit tests of the function updateClientContact in client-contact", () => {
  beforeEach(() => {
    clientContactService = new ClientContactService(userService)
    mockCtx = createMockContext()
  })

  test("Testing empty parameters passed into the updateClientContact function", async () => {
    await expect(clientContactService.updateClientContact("", "", "", "", "", mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty contactID passed into the updateClientContact function", async () => {
    const plannerUUID = v4()
    await expect(clientContactService.updateClientContact("", "test@gmail.com", "test", "tester", plannerUUID, mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty name parameters passed into the updateClientContact function", async () => {
    const plannerUUID = v4()
    const contactUUID = v4()
    await expect(clientContactService.updateClientContact(contactUUID, "test@gmail.com", "", "tester", plannerUUID, mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty surname parameters passed into the updateClientContact function", async () => {
    const plannerUUID = v4()
    const contactUUID = v4()
    await expect(clientContactService.updateClientContact(contactUUID, "test@gmail.com", "test", "", plannerUUID, mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty plannerID passed into the updateClientContact function", async () => {
    const contactUUID = v4()
    await expect(clientContactService.updateClientContact(contactUUID, "test@gmail.com", "test", "tester", "", mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing valid update in updateClientContact function", async () => {
    const contactUUID = v4()
    const testUUID = v4()
    const testContactID = v4()
    const plannerUUID = v4()

    const clientContact = {
      contactId: testContactID,
      contactEmail: "test@gmail.com",
      name: "test",
      surname: "tester",
      plannerID: testUUID
    }
    mockCtx.prisma.contacts.update.mockResolvedValue(clientContact)

    expect(await clientContactService.updateClientContact(contactUUID, "test@gmail.com", "test", "tester", plannerUUID, mockCtx)).toBe("Client contact updated.")
  })

  test("Testing update that throws an exception in updateClientContact function", async () => {
    const contactUUID = v4()
    const plannerUUID = v4()

    mockCtx.prisma.contacts.update.mockRejectedValue(new BadRequestException())

    await expect(clientContactService.updateClientContact(contactUUID, "test@gmail.com", "test", "tester", plannerUUID, mockCtx)).rejects.toThrow("Could not update contact")
  })
})
