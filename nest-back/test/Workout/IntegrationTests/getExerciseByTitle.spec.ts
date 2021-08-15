import { Context, ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { UserService } from "../../../src/User/user.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient
const uuidExercise = uuidv4()

describe("Integration tests of the getExerciseByTitle function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma, userService)
    ctx = ActualPrisma()
    await ctx.prisma.exercise.deleteMany()
    await ctx.prisma.exercise.create({
      data: {
        exerciseID: uuidExercise,
        exerciseTitle: "TestExercise",
        exerciseDescription: "TestDescription",
        repRange: "TestRange",
        sets: 4,
        poseDescription: "TestPDesc",
        restPeriod: 2,
        duration: 2
      }
    })
  })

  test("Should receive valid information about exercise with corresponding title", async () => {
    const Exercise = [{
      exerciseID: uuidExercise,
      exerciseTitle: "TestExercise",
      exerciseDescription: "TestDescription",
      repRange: "TestRange",
      sets: 4,
      poseDescription: "TestPDesc",
      restPeriod: 2,
      tags: [],
      duration: 2
    }]

    const response = await workoutService.getExerciseByTitle("TestExercise", ctx)

    expect(response).toStrictEqual(Exercise)
  })

  test("Should not receive valid information about exercise with corresponding title as workout does not exist", async () => {
    await expect(workoutService.getExerciseByTitle("", ctx)).rejects.toThrow("No exercises were found in the database with the specified title.")
  })
})
