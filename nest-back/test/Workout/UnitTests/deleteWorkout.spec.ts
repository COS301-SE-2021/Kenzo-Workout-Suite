import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"
import * as fs from "fs"
import { v4 as uuidv4 } from "uuid"
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
    const Workout = {
      workoutID: uuidv4(),
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: uuidv4()
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout)
    mockCtx.prisma.workout.delete.mockResolvedValue(Workout)

    await expect(workoutService.deleteWorkout(Workout.workoutID, mockCtx)).resolves.toEqual("Workout Deleted.")
  })

  test("Null exercise ID passed in, should throw PreconditionFailedException", async () => {
    let workout
    mockCtx.prisma.workout.delete.mockResolvedValue(workout)
    await expect(workoutService.deleteWorkout("", ctx)).rejects.toThrow("Parameters can not be left empty.")
  })
})
