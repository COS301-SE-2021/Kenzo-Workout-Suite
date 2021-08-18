import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { UserService } from "../../../src/User/user.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

describe("Unit tests of the getTags function in the Workout Service", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma, userService)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Should receive valid information about all tags", async () => {
    const tag = [{
      label: "test",
      textColour: "test",
      backgroundColour: "test"
    }]
    mockCtx.prisma.tag.findMany.mockResolvedValue(tag)

    const response = await workoutService.getTags(ctx)

    expect(response).toBe(tag)
  })
})
