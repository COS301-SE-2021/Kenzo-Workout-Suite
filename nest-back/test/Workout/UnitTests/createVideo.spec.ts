import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { UserService } from "../../../src/User/user.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"
let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

// const wUUID = uuidv4()

describe("Unit tests of the createVideo function in the Workout Service", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma, userService)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Should not receive error for invalid workout ID", async () => {
    let workout
    mockCtx.prisma.workout.create.mockResolvedValue(workout)
    await expect(workoutService.createVideo("", 2, "test", 2, 2, ctx)).rejects.toThrow("Invalid Workout ID passed in.")
  })

  test("Should not receive error for non-existent workout ID", async () => {
    let workout
    mockCtx.prisma.workout.create.mockResolvedValue(workout)
    await expect(workoutService.createVideo("testesttest", 2, "test", 2, 2, ctx)).rejects.toThrow("No workouts were found in the database with the specified id.")
  })
})
