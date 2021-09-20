import { ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"
import { userType } from "@prisma/client"

let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient
const ctx = ActualPrisma()

const uuidPlanner = uuidv4()

describe("Integration tests of the getWorkoutByPlanner function in the Workout Service", () => {
  beforeEach(async () => {
    await ctx.prisma.workout.deleteMany()
    await ctx.prisma.user.deleteMany()
    workoutService = new WorkoutService(prisma, userService)
  })

  test("Should receive valid information about workout with corresponding planner", async () => {
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

    const response = await workoutService.getWorkoutByPlanner(uuidPlanner, ctx)

    expect(response).toStrictEqual(workout)
  })

  test("Should not receive valid information about workout with corresponding planner as workout does not exist", async () => {
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
    await expect(workoutService.getWorkoutByPlanner("notindatabase@gmail.com", ctx)).rejects.toThrow("No workouts were found in the database with the specified planner.")
  })
})
