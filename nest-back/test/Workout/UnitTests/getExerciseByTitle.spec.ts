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

describe("Unit tests of the getExerciseByTitle function in the Workout Service", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma, userService)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Should receive valid information about exercise with corresponding title", async () => {
    const Exercise = [{
      exerciseID: uuidv4(),
      exerciseTitle: "TestExercise",
      exerciseDescription: "TestDescription",
      repRange: "TestRange",
      sets: 4,
      poseDescription: "TestPDesc",
      restPeriod: 2,
      tags: [],
      duration: 2,
      plannerID: ""
    }]

    mockCtx.prisma.exercise.findMany.mockResolvedValue(Exercise)

    const response = await workoutService.getExerciseByTitle("TestExercise", ctx)

    expect(response).toBe(Exercise)
  })

  test("Should not receive valid information about exercise with corresponding title as workout does not exist", async () => {
    let Exercise
    mockCtx.prisma.exercise.findMany.mockResolvedValue(Exercise)
    await expect(workoutService.getExerciseByTitle("", ctx)).rejects.toThrow("No exercises were found in the database with the specified title.")
  })
})
