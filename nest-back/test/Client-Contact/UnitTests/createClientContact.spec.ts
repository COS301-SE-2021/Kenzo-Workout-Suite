import { MockContext, Context, createMockContext } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"

let mockCtx: MockContext
let ctx: Context
let clientContact: ClientContactService

describe("Unit tests of the function findUserByUUID in the UserService", () => {
  beforeEach(() => {
    clientContact = new ClientContactService()
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Test, Null values passed into findUserByUUID should throw BadRequestException", async () => {
    await expect(userService.findUserByUUID("", ctx)).rejects.toThrow("Null values cannot be passed in for userId")
  })
})
