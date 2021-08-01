import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

beforeEach(() => {
  workoutService = new WorkoutService(prisma, userService)
  mockCtx = createMockContext()
  ctx = (mockCtx as unknown) as Context
})
describe("Unit tests for deleteWorkout in workout subsystem", () => {
  test("Should delete workout", async () => {
    let workout
    mockCtx.prisma.workout.delete.mockResolvedValue(workout)
    await expect(workoutService.deleteWorkout("invalid", mockCtx)).resolves.toEqual(
      "Workout Deleted."
    )
  })

  test("Null exercise ID passed in, should throw PreconditionFailedException", async () => {
    let workout
    mockCtx.prisma.workout.delete.mockResolvedValue(workout)
    await expect(workoutService.deleteWorkout("", ctx)).rejects.toThrow("Parameters can not be left empty.")
  })
})
