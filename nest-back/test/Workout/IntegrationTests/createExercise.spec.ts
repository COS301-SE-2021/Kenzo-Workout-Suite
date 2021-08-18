import { Context, ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import {
  Tag,
  userType
} from "@prisma/client"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"

let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient
const userUUID = uuidv4()
const exerciseUUID = uuidv4()

beforeEach(async () => {
  workoutService = new WorkoutService(prisma, userService)
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
describe("Integration tests for createExercise in Workout Service", () => {
  const images:string[] = ["base64line"]
  test("Should create exercise", async () => {
    const Exercise = {
      exercise: exerciseUUID,
      exerciseTitle: "TestExercise",
      exerciseDescription: "TestDescription",
      repRange: "TestRange",
      sets: 4,
      poseDescription: "TestPDesc",
      restPeriod: 2,
      duration: 2,
      plannerID: userUUID
    }
    const emptyTag: Tag[] = []

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, emptyTag, Exercise.duration, userUUID, images, ctx)).resolves.toEqual(
      "Exercise created."
    )
  })

  test("Should not create exercise [Throws Parameters can not be left empty.]", async () => {
    const Exercise = {
      exercise: exerciseUUID,
      exerciseTitle: "",
      exerciseDescription: "TestDescription",
      repRange: "TestRange",
      sets: 4,
      poseDescription: "TestPDesc",
      restPeriod: 2,
      duration: 2,
      plannerID: userUUID
    }
    const emptyTag: Tag[] = []

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, emptyTag, Exercise.duration, userUUID, images, ctx)).rejects.toThrow(
      "Parameters can not be left empty!"
    )
  })
})
