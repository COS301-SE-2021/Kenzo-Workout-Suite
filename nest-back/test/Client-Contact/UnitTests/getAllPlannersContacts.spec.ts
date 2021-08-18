import { MockContext, createMockContext } from "../../../context"
import { ClientContactService } from "../../../src/client-contact/client-contact.service"
import { UserService } from "../../../src/User/user.service"
import { v4 } from "uuid"

let mockCtx: MockContext
let clientContactService: ClientContactService
let userService: UserService

describe("Unit tests of the function getAllPlannersContacts in client-contact", () => {
  beforeEach(() => {
    clientContactService = new ClientContactService(userService)
    mockCtx = createMockContext()
  })

  test("Testing empty parameters passed into the getAllPlannersContacts", async () => {
    await expect(clientContactService.getAllPlannersContacts("", mockCtx)).rejects.toThrow("PlannerID field can not be left empty")
  })

  test("Testing null parameters passed into the getAllPlannersContacts", async () => {
    let plannerID
    await expect(clientContactService.getAllPlannersContacts(plannerID, mockCtx)).rejects.toThrow("PlannerID field can not be left empty")
  })

  test("Testing UUID with no contacts parameters passed into the getAllPlannersContacts", async () => {
    const plannerID = v4()
    let contacts
    mockCtx.prisma.contacts.findMany.mockResolvedValue(contacts)
    await expect(clientContactService.getAllPlannersContacts(plannerID, mockCtx)).rejects.toThrow("No client contacts found.")
  })

  test("Testing UUID with valid parameter contacts parameters passed into the getAllPlannersContacts", async () => {
    const plannerID = v4()

    const contact1ID = v4()
    const contact2ID = v4()

    const contacts = [
      {
        contactId: contact1ID,
        contactEmail: "test1@gmail.com",
        name: "name1",
        surname: "surname1",
        plannerID: plannerID
      },
      {
        contactId: contact2ID,
        contactEmail: "test2@gmail.com",
        name: "name2",
        surname: "surname2",
        plannerID: plannerID
      }
    ]
    mockCtx.prisma.contacts.findMany.mockResolvedValue(contacts)
    expect(await clientContactService.getAllPlannersContacts(plannerID, mockCtx)).toBe(contacts)
  })

  test("Testing UUID with valid parameter contacts parameters passed into the getAllPlannersContacts (Only a single contact)", async () => {
    const plannerID = v4()
    const contact1ID = v4()

    const contacts = [
      {
        contactId: contact1ID,
        contactEmail: "test1@gmail.com",
        name: "name1",
        surname: "surname1",
        plannerID: plannerID
      }
    ]
    mockCtx.prisma.contacts.findMany.mockResolvedValue(contacts)
    expect(await clientContactService.getAllPlannersContacts(plannerID, mockCtx)).toBe(contacts)
  })
})
