import { MockContext, createMockContext } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"
import { BadRequestException } from "@nestjs/common"

let mockCtx: MockContext
let clientContactService: ClientContactService
let userService: UserService

describe("Unit tests of the function createClientContact in client-contact", () => {
  beforeEach(() => {
    clientContactService = new ClientContactService(userService)
    mockCtx = createMockContext()
  })

  test("Testing empty parameters passed into the createClientContact function", async () => {
    await expect(clientContactService.createClientContact("", "", "", "", mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty contactEmail passed into the createClientContact function", async () => {
    const testUUID = v4()
    await expect(clientContactService.createClientContact("", "test", "tester", testUUID, mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty name passed into the createClientContact function", async () => {
    const testUUID = v4()
    await expect(clientContactService.createClientContact("test@gmail.com", "", "tester", testUUID, mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty surname passed into the createClientContact function", async () => {
    const testUUID = v4()
    await expect(clientContactService.createClientContact("test@gmail.com", "test", "", testUUID, mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing empty plannerID passed into the createClientContact function", async () => {
    await expect(clientContactService.createClientContact("test@gmail.com", "test", "tester", "", mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })

  test("Testing valid parameters passed into the createClientContact function should return created response", async () => {
    const testUUID = v4()
    const testContactID = v4()
    const clientContact = {
      contactId: testContactID,
      contactEmail: "test@gmail.com",
      name: "test",
      surname: "tester",
      plannerID: testUUID
    }
    mockCtx.prisma.contacts.create.mockResolvedValue(clientContact)
    expect(await clientContactService.createClientContact("test@gmail.com", "test", "tester", testUUID, mockCtx)).toBe("Client contact created.")
  })

  test("Testing valid parameters passed into the createClientContact function however prisma throws error, should return could not create client contact error", async () => {
    const testUUID = v4()
    mockCtx.prisma.contacts.create.mockRejectedValue(new BadRequestException("test"))

    await expect(clientContactService.createClientContact("test@gmail.com", "test", "tester", testUUID, mockCtx)).rejects.toThrow("Could not create client contact")
  })
})
