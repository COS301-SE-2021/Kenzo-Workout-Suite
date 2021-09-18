import { ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"
import { userType } from "@prisma/client"

let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

const userUUID = uuidv4()
const exerciseUUID = uuidv4()
const ctx = ActualPrisma()

describe("Integration tests of the deleteExercise function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma, userService)
    await ctx.prisma.exercise.deleteMany()
    await ctx.prisma.user.deleteMany()
    await ctx.prisma.tag.deleteMany()

  })

  test("Null exercise ID passed in, should throw PreconditionFailedException", async () => {
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
    await ctx.prisma.exercise.deleteMany()
    await ctx.prisma.exercise.create({
      data: {
        exerciseID: exerciseUUID,
        exerciseTitle: "TestExercise",
        exerciseDescription: "TestDescription",
        repRange: "TestRange",
        sets: 4,
        poseDescription: "TestPDesc",
        restPeriod: 2,
        duration: 2,
        plannerID: userUUID
      }
    })
    await expect(workoutService.deleteExercise("", ctx)).rejects.toThrow("Parameter can not be left empty.")
  })

  test("Invalid exercise ID passed in, should throw NotFoundException", async () => {
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
    await ctx.prisma.exercise.deleteMany()
    await ctx.prisma.exercise.create({
      data: {
        exerciseID: exerciseUUID,
        exerciseTitle: "TestExercise",
        exerciseDescription: "TestDescription",
        repRange: "TestRange",
        sets: 4,
        poseDescription: "TestPDesc",
        restPeriod: 2,
        duration: 2,
        plannerID: userUUID
      }
    })
    await expect(workoutService.deleteExercise("invalid", ctx)).rejects.toThrow("")
  })
})
