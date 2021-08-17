import { MockContext, createMockContext, Context, ActualPrisma } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"
import { BadRequestException } from "@nestjs/common"

let ctx: Context
let clientContactService: ClientContactService
let userService: UserService

describe("Integration tests of the function deleteClientContact in client-contact", () => {
  beforeEach(async () => {
    clientContactService = new ClientContactService(userService)
    ctx = ActualPrisma()

    await ctx.prisma.contacts.deleteMany()

    await ctx.prisma.contacts.deleteMany()
    await ctx.prisma.user.deleteMany()
  })

  test("Testing empty parameters passed into the getAllPlannersContacts", async () => {
    const testContactID = v4()

    const createdUser = await ctx.prisma.user.create({
      data: {
        firstName: "testPlanner",
        lastName: "testSurname",
        userType: "PLANNER",
        email: "testemail@gmail.com",
        password: "Zelu2000Test"
      }
    })

    await ctx.prisma.contacts.create({
      data: {
        contactId: testContactID,
        contactEmail: "test@gmail.com",
        name: "test",
        surname: "tester",
        plannerID: createdUser.userID
      }
    })

    expect(await clientContactService.deleteClientContact(testContactID, ctx)).toBe("Client contact deleted.")
  })
})
