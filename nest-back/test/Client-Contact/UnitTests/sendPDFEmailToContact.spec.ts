import { MockContext, createMockContext } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"

let mockCtx: MockContext
let clientContactService: ClientContactService
let userService: UserService

describe("Unit tests of the function createClientContact in client-contact", () => {
  beforeEach(() => {
    clientContactService = new ClientContactService(userService)
    mockCtx = createMockContext()
  })

  test("Testing empty parameters passed into the getAllPlannersContacts", async () => {
    await expect(clientContactService.getAllPlannersContacts("", mockCtx)).rejects.toThrow("PlannerID field can not be left empty")
  })
})
