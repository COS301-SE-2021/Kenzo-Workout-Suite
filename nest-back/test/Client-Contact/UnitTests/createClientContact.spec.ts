import { MockContext, Context, createMockContext } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"

let mockCtx: MockContext
let ctx: Context
let clientContactService: ClientContactService
let userService: UserService

describe("Unit tests of the function createClientContact in client-contact", () => {
  beforeEach(() => {
    clientContactService = new ClientContactService(userService)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("", async () => {
    await expect(clientContactService.createClientContact("", "", "", "", mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })
})
