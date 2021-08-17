import { ActualPrisma, Context } from "../../../context"
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

    await ctx.prisma.contacts.deleteMany()
    await ctx.prisma.user.deleteMany()
  })

  test("Testing UUID with valid parameter contacts parameters passed into the getAllPlannersContacts", async () => {
    const contact1ID = v4()
    const contact2ID = v4()

    const createdUser = await ctx.prisma.user.create({
      data: {
        firstName: "testPlanner",
        lastName: "testSurname",
        userType: "PLANNER",
        email: "testemail@gmail.com",
        password: "Zelu2000Test"
      }
    })

    const createdContact1 = await ctx.prisma.contacts.create({
      data: {
        contactId: contact1ID,
        contactEmail: "test1@gmail.com",
        name: "name1",
        surname: "surname1",
        plannerID: createdUser.userID
      }
    })

    const createdContact2 = await ctx.prisma.contacts.create({
      data: {
        contactId: contact2ID,
        contactEmail: "test2@gmail.com",
        name: "name2",
        surname: "surname2",
        plannerID: createdUser.userID
      }
    })

    const contacts = [
      createdContact1,
      createdContact2
    ]

    expect(await clientContactService.getAllPlannersContacts(createdUser.userID, ctx)).toStrictEqual(contacts)
  })
})
