import { Context, ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import {
  Exercise,
  userType
} from "@prisma/client"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"
import { JwtService } from "@nestjs/jwt"

let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let Jwt : JwtService
let prisma: PrismaClient
const userUUID = uuidv4()
const exerciseUUID = uuidv4()

const exercise = {
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

beforeEach(async () => {
  userService = new UserService(Jwt)
  workoutService = new WorkoutService(prisma, userService)
  ctx = ActualPrisma()
  await ctx.prisma.exercise.deleteMany()
  await ctx.prisma.user.deleteMany()
  await ctx.prisma.tag.deleteMany()
  const myUser = {
    userID: userUUID,
    email: "test@gmail.com",
    firstName: "test",
    lastName: "tester",
    password: "Test123*",
    userType: userType.PLANNER,
    dateOfBirth: new Date("2000-05-30")
  }

  await ctx.prisma.user.create({
    data: myUser
  })

  await ctx.prisma.exercise.create({
    data: exercise
  })
})
describe("Integration tests of the updateWorkout function in the Workout Service", () => {
  test("Should update workout [no exercises]", async () => {
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
    const createdWorkout = await ctx.prisma.workout.create({
      data: Workout
    })

    const emptyExercise: Exercise[] = []

    await expect(workoutService.updateWorkout(workoutUUID, "WorkoutUpdateTest", Workout.workoutDescription, emptyExercise, userUUID, ctx)).resolves.toEqual(
      "Workout Updated."
    )
  })

  test("Should update new workout [With exercises]", async () => {
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
    const fullExercise = [exercise]

    await expect(workoutService.updateWorkout(workoutUUID, "WorkoutUpdateTest", Workout.workoutDescription, fullExercise, userUUID, ctx)).resolves.toEqual(
      "Workout Updated."
    )
  })
})
