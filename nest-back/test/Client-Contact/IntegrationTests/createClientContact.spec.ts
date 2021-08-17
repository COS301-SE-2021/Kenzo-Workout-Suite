import { MockContext, Context, createMockContext } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"
import { BadRequestException } from "@nestjs/common"

let mockCtx: MockContext
let ctx: Context
let clientContactService: ClientContactService
let userService: UserService

describe("Integration tests of the function createClientContact in client-contact", () => {
  beforeEach(() => {
    clientContactService = new ClientContactService(userService)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Testing valid parameters passed into the createClientContact function", async () => {
    const testUUID = v4()
    expect(await clientContactService.createClientContact("test@gmail.com", "test", "tester", testUUID, ctx)).toBe("Client contact created.")
  })
})
