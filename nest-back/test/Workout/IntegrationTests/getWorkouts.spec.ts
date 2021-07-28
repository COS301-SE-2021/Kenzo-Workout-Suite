import { Context, ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

const uuidPlanner = uuidv4()

describe("Integration tests of the getWorkouts function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma)
    ctx = ActualPrisma()
    await ctx.prisma.workout.deleteMany()
    await ctx.prisma.user.deleteMany()
    await ctx.prisma.user.create({
      data: {
        userID: uuidPlanner,
        email: "test&gmail.com",
        firstName: "test",
        lastName: "test",
        password: "Test123!",
        dateOfBirth: null,
        userType: "PLANNER"
      }
    })
    await ctx.prisma.workout.create({
      data: {
        workoutID: "1",
        workoutTitle: "test",
        workoutDescription: "test",
        plannerID: uuidPlanner
      }
    })
  })

  test("Should receive valid information about all workouts", async () => {
    const workout = [{
      workoutID: "1",
      workoutTitle: "test",
      workoutDescription: "test",
      exercises: [],
      plannerID: uuidPlanner
    }]

    const response = await workoutService.getWorkouts(ctx)

    expect(response).toStrictEqual(workout)
  })
})
