import { Context, ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import {
  userType
} from "@prisma/client"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient
const userUUID = uuidv4()

beforeEach(async () => {
  workoutService = new WorkoutService(prisma)
  ctx = ActualPrisma()
  await ctx.prisma.exercise.deleteMany()
  await ctx.prisma.user.deleteMany()
  const myUser = {
    userID: userUUID,
    email: "test@gmail.com",
    firstName: "test",
    lastName: "tester",
    password: "Test123*",
    userType: userType.PLANNER,
    dateOfBirth: null
  }

  await ctx.prisma.user.create({
    data: myUser
  })
})
describe("Integration tests of the deleteWorkout function in the Workout Service", () => {
  test("Should delete workout", async () => {
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
    await expect(workoutService.deleteWorkout(workoutUUID, ctx)).resolves.toEqual(
      "Workout Deleted."
    )
  })

  test("Should not delete workout [Parameters can not be left empty.]", async () => {
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
