import { MockContext, ActualPrisma, Context } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"

let ctx: Context
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

    const contactID = v4()

    await ctx.prisma.contacts.create({
      data: {
        contactId: contactID,
        contactEmail: "test@gmail.com",
        name: "test",
        surname: "tester",
        plannerID: createdUser.userID
      }
    })

    expect(await clientContactService.updateClientContact(contactID, "test2@gmail.com", "test2", "tester2", createdUser.userID, ctx)).toBe("Client contact updated.")
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

    const contactID = v4()

    await ctx.prisma.contacts.create({
      data: {
        contactId: contactID,
        contactEmail: "test@gmail.com",
        name: "test",
        surname: "tester",
        plannerID: createdUser.userID
      }
    })

    expect(await clientContactService.updateClientContact(contactID, "test2@gmail.com", "test2", "tester2", v4(), ctx)).toBe("Client contact updated.")
  })
})
