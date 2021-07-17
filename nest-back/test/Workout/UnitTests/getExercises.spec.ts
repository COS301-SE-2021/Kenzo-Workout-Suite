import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { uuid } from "uuidv4"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

describe("Unit tests of the getExercises function in the Workout Service", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Should receive valid information about all exercises", async () => {
    const Exercise = [{
      exerciseID: uuid(),
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

    const response = await workoutService.getExercises(ctx)

    expect(response).toBe(Exercise)
  })
})
