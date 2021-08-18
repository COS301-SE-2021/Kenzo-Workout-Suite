import { MockContext, createMockContext } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"
import { BadRequestException } from "@nestjs/common"

let mockCtx: MockContext
let clientContactService: ClientContactService
let userService: UserService

describe("Unit tests of the function deleteClientContact in client-contact", () => {
  beforeEach(() => {
    clientContactService = new ClientContactService(userService)
    mockCtx = createMockContext()
  })

  test("Testing empty parameters passed into the deleteClientContact", async () => {
    await expect(clientContactService.deleteClientContact("", mockCtx)).rejects.toThrow("Parameters can not be left empty!")
  })

  test("Testing null parameters passed into the deleteClientContact", async () => {
    let empty
    await expect(clientContactService.deleteClientContact(empty, mockCtx)).rejects.toThrow("Parameters can not be left empty!")
  })

  test("Testing valid parameters passed into the deleteClientContact where prisma returns without throwing", async () => {
    let deletedContact

    mockCtx.prisma.contacts.delete.mockResolvedValue(deletedContact)
    expect(await clientContactService.deleteClientContact(v4(), mockCtx)).toBe("Client contact deleted.")
  })

  test("Testing prisma throwing an exception, in deleteClientContact, should throw an error with the message Could not delete contact", async () => {
    mockCtx.prisma.contacts.delete.mockRejectedValue(new BadRequestException())
    await expect(clientContactService.deleteClientContact(v4(), mockCtx)).rejects.toThrow("Could not delete contact")
  })
})
