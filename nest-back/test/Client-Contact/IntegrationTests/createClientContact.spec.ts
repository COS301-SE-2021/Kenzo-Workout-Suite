import { Context, ActualPrisma } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"

let ctx: Context
let clientContactService: ClientContactService
let userService: UserService

describe("Integration tests of the function createClientContact in client-contact", () => {
  beforeEach(async () => {
    clientContactService = new ClientContactService(userService)
    ctx = ActualPrisma()

    await ctx.prisma.contacts.deleteMany()
    await ctx.prisma.user.deleteMany()
  })

  test("Testing valid parameters passed into the createClientContact function, should return valid createdContact", async () => {
    const createdUser = await ctx.prisma.user.create({
      data: {
        firstName: "testPlanner",
        lastName: "testSurname",
        userType: "PLANNER",
        email: "testemail@gmail.com",
        password: "Zelu2000Test"
      }
    })

    await clientContactService.createClientContact("test@gmail.com", "test", "tester", createdUser.userID, ctx)

    const createdContact = await ctx.prisma.contacts.findFirst({
      where: {
        contactEmail: "test@gmail.com"
      }
    })

    expect(createdContact!).toStrictEqual({
      contactId: createdContact!.contactId,
      contactEmail: "test@gmail.com",
      name: "test",
      surname: "tester",
      plannerID: createdUser.userID
    })
  })
})
