import { ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import {
  userType
} from "@prisma/client"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"

const ctx = ActualPrisma()
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient
const userUUID = uuidv4()

beforeEach(async () => {
  workoutService = new WorkoutService(prisma, userService)
  await ctx.prisma.exercise.deleteMany()
  await ctx.prisma.user.deleteMany()
})
describe("Integration tests of the deleteWorkout function in the Workout Service", () => {
  test("Should delete workout", async () => {
    const myUser = {
      userID: userUUID,
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      password: process.env.TESTPASSWORD!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    await ctx.prisma.user.create({
      data: myUser
    })

    const workoutUUID = uuidv4()
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      planner: {
        connect: {
          userID: userUUID
        }
      }
    }
    await ctx.prisma.workout.create({
      data: Workout
    })
    await expect(workoutService.deleteWorkout(workoutUUID, ctx)).resolves.toEqual(
      "Workout Deleted."
    )
  })

  test("Should not delete workout [Parameters can not be left empty.]", async () => {
    const myUser = {
      userID: userUUID,
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      password: process.env.TESTPASSWORD!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    await ctx.prisma.user.create({
      data: myUser
    })

    const workoutUUID = uuidv4()
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: userUUID
    }

    await ctx.prisma.workout.create({
      data: Workout
    })
    await expect(workoutService.deleteWorkout("", ctx)).rejects.toThrow("Parameters can not be left empty.")
  })

  test("Should not delete workout [Workout with provided ID does not exist]", async () => {
    const myUser = {
      userID: userUUID,
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      password: process.env.TESTPASSWORD!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }

    await ctx.prisma.user.create({
      data: myUser
    })
    const workoutUUID = uuidv4()
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: userUUID
    }

    await ctx.prisma.workout.create({
      data: Workout
    })
    await expect(workoutService.deleteWorkout("fake", ctx)).rejects.toThrow("Workout with provided ID does not exist")
  })
})
