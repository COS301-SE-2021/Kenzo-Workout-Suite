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

const eUUID = uuidv4()

describe("Unit tests of the getExerciseByTitle function in the Workout Service", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma, userService)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Should receive valid information about exercise with corresponding title with no images", async () => {
    const Exercise = [{
      exerciseID: eUUID,
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

    const expected = [{
      exerciseID: eUUID,
      exerciseTitle: "TestExercise",
      exerciseDescription: "TestDescription",
      repRange: "TestRange",
      sets: 4,
      poseDescription: "TestPDesc",
      restPeriod: 2,
      tags: [],
      duration: 2,
      images: []
    }]

    mockCtx.prisma.exercise.findMany.mockResolvedValue(Exercise)

    const response = await workoutService.getExerciseByTitle("TestExercise", ctx)

    await expect(response).toStrictEqual(expected)
  })

  test("Should receive valid information about exercise with corresponding title with images", async () => {
    const Exercise = [{
      exerciseID: eUUID,
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

    const base64 = [{
      ID: eUUID,
      poseDescription: "TestDescription",
      images: ["1", "2", "3", "4"]
    }]

    const expected = [{
      exerciseID: eUUID,
      exerciseTitle: "TestExercise",
      exerciseDescription: "TestDescription",
      repRange: "TestRange",
      sets: 4,
      poseDescription: "TestPDesc",
      restPeriod: 2,
      tags: [],
      duration: 2,
      images: [{
        ID: eUUID,
        poseDescription: "TestDescription",
        images: ["1", "2", "3", "4"]
      }]
    }]
    spyOn(workoutService, "convertImageBase64").and.returnValue(base64)

    mockCtx.prisma.exercise.findMany.mockResolvedValue(Exercise)

    const response = await workoutService.getExerciseByTitle("TestExercise", ctx)

    await expect(response).toStrictEqual(expected)
  })

  test("Should not receive valid information about exercise with corresponding title as workout does not exist", async () => {
    let Exercise
    mockCtx.prisma.exercise.findMany.mockResolvedValue(Exercise)
    await expect(workoutService.getExerciseByTitle("", ctx)).rejects.toThrow("No exercises were found in the database with the specified title.")
  })
})
