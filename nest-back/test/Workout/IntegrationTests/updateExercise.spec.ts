import { Context, ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { Tag } from "@prisma/client"
import { UserService } from "../../../src/User/user.service"

let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

const uuidExercise = uuidv4()
const uuidPlanner = uuidv4()

describe("Integration tests of the updateExercise function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma, userService)
    ctx = ActualPrisma()
    await ctx.prisma.exercise.deleteMany()
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
  })

  test("Valid exercise passed in without tags, should receive successful message", async () => {
    await ctx.prisma.exercise.create({
      data: {
        exerciseID: uuidExercise,
        exerciseTitle: "TestExercise",
        exerciseDescription: "TestDescription",
        repRange: "TestRange",
        sets: 4,
        poseDescription: "TestPDesc",
        restPeriod: 2,
        duration: 2,
        plannerID: uuidPlanner
      }
    })

    const emptyTag: Tag[] = []

    const response = await workoutService.updateExercise(uuidExercise, "test", "test", "test", 4, "test", 2, emptyTag, 2, uuidPlanner, ctx)
    expect(response).toStrictEqual("Exercise updated.")
  })

  test("Null exercise passed in, should throw PreconditionFailedException", async () => {
    await expect(workoutService.updateExercise("", "", "", "", 0, "", 0, [], 0, "", ctx)).rejects.toThrow("Invalid exercise object passed in.")
  })

  test("Incomplete exercise passed in, should throw PreconditionFailedException", async () => {
    await expect(workoutService.updateExercise("test", "", "test", "", 0, "test", 0, [], 0, "", ctx)).rejects.toThrow("Invalid exercise object passed in.")
  })

  test("Nonexistent exercise, should throw NotFoundException", async () => {
    await expect(workoutService.updateExercise("test", "test", "test", "test", 0, "test", 0, [], 0, "", ctx)).rejects.toThrow("Invalid exercise object passed in.")
  })
})
