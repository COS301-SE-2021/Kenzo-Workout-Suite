import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { UserService } from "../../../src/User/user.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

describe("Unit tests of the getWorkoutByPlanner function in the Workout Service", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma, userService)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Should receive valid information about workout with corresponding planner", async () => {
    const uuidPlanner = uuidv4()
    const workout = [{
      workoutID: uuidv4(),
      workoutTitle: "test",
      workoutDescription: "test",
      plannerID: uuidPlanner
    }]
    mockCtx.prisma.workout.findMany.mockResolvedValue(workout)

    const response = await workoutService.getWorkoutByPlanner(uuidPlanner, ctx)

    expect(response).toBe(workout)
  })

  test("Should not receive valid information about workout with corresponding planner as workout does not exist", async () => {
    let workout
    mockCtx.prisma.workout.findMany.mockResolvedValue(workout)
    await expect(workoutService.getWorkoutByPlanner("000", ctx)).rejects.toThrow("No workouts were found in the database with the specified planner.")
  })
})
