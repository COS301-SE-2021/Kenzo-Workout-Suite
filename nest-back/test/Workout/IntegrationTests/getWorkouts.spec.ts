import { ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"
import { userType } from "@prisma/client"

const ctx = ActualPrisma()
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

const uuidPlanner = uuidv4()

describe("Integration tests of the getWorkouts function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma, userService)
    await ctx.prisma.workout.deleteMany()
    await ctx.prisma.user.deleteMany()
  })

  test("Should receive valid information about all workouts", async () => {
    await ctx.prisma.user.create({
      data: {
        userID: uuidPlanner,
        email: process.env.TESTEMAIL!,
        firstName: "test",
        lastName: "tester",
        password: process.env.TESTPASSWORD!,
        userType: userType.PLANNER,
        dateOfBirth: null
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
