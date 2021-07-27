import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

describe("Unit tests of the createTag function in the Workout Service", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Valid tag passed in, should receive successful message", async () => {
    const tag = {
      label: "test",
      textColour: "test",
      backgroundColour: "test"
    }
    mockCtx.prisma.tag.create.mockResolvedValue(tag)

    const response = await workoutService.createTag("test", "test", "test", ctx)

    expect(response).toBe(tag)
  })

  test("Valid tag passed in with inappropriate label, should receive error message", async () => {
    let tag
    mockCtx.prisma.tag.create.mockResolvedValue(tag)
    await expect(workoutService.createTag("Sh!t", "", "", ctx)).rejects.toThrow("Profanity contained in label title.")
  })

  test("Null tag passed in, should throw PreconditionFailedException", async () => {
    let tag
    mockCtx.prisma.tag.create.mockResolvedValue(tag)
    await expect(workoutService.createTag("", "", "", ctx)).rejects.toThrow("Parameters can not be left empty.")
  })

  test("Invalid tag parameters passed in, should throw PreconditionFailedException", async () => {
    let tag
    mockCtx.prisma.tag.create.mockResolvedValue(tag)
    await expect(workoutService.createTag("test", "", "test", ctx)).rejects.toThrow("Parameters can not be left empty.")
  })
})
