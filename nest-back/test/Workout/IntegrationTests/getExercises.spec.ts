import { ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { UserService } from "../../../src/User/user.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"

const ctx = ActualPrisma()
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient
const uuidExercise = uuidv4()

describe("Integration tests of the getExercises function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma, userService)
    await ctx.prisma.exercise.deleteMany()
  })

  test("Should receive valid information about all exercises with no images", async () => {
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
    const Exercise = [{
      exerciseID: uuidExercise,
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

    const response = await workoutService.getExercises(ctx)

    expect(response).toStrictEqual(Exercise)
  })
})
