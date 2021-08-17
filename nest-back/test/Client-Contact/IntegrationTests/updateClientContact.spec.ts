import { MockContext, ActualPrisma, Context } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"

let ctx: Context
let mockCtx: MockContext
let clientContactService: ClientContactService
let userService: UserService

describe("Unit tests of the function createClientContact in client-contact", () => {
  beforeEach(async () => {
    clientContactService = new ClientContactService(userService)
    ctx = ActualPrisma()

    await ctx.prisma.contacts.deleteMany()
    await ctx.prisma.user.deleteMany()
  })

  test("Testing empty parameters passed into the updateClientContact function", async () => {
    const createdUser = await ctx.prisma.user.create({
      data: {
        firstName: "testPlanner",
        lastName: "testSurname",
        userType: "PLANNER",
        email: "testemail@gmail.com",
        password: "Zelu2000Test"
      }
    })

    await expect(clientContactService.updateClientContact("", "", "", "", "", mockCtx)).rejects.toThrow("Parameters can not be left empty")
  })
})
