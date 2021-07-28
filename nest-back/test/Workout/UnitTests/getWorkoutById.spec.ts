import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

describe("Unit tests of the getWorkoutById function in the Workout Service", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Should not receive valid information about workout with corresponding id as workout does not exist", async () => {
    let workout
    mockCtx.prisma.workout.findUnique.mockResolvedValue(workout)
    await expect(workoutService.getWorkoutById("", ctx)).rejects.toThrow("No workouts were found in the database with the specified id.")
  })
})
