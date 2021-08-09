import { Context, ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { UserService } from "../../../src/User/user.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

const uuidPlanner = uuidv4()
const uuidWorkout = uuidv4()

describe("Integration tests of the getWorkoutById function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma, userService)
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
        workoutID: uuidWorkout,
        workoutTitle: "test",
        workoutDescription: "test",
        plannerID: uuidPlanner
      }
    })
  })

  test("Should receive valid information about workout with corresponding id", async () => {
    const workout = {
      workoutID: uuidWorkout,
      workoutTitle: "test",
      workoutDescription: "test",
      exercises: [],
      plannerID: uuidPlanner
    }

    const response = await workoutService.getWorkoutById(uuidWorkout, ctx)

    expect(response).toStrictEqual(workout)
  })

  test("Should not receive valid information about workout with corresponding id as workout does not exist", async () => {
    await expect(workoutService.getWorkoutById("", ctx)).rejects.toThrow("No workouts were found in the database with the specified id.")
  })
})
