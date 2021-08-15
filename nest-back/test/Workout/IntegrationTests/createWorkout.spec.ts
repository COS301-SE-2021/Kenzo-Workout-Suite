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
let prisma: PrismaClient
let Jwt : JwtService
const userUUID = uuidv4()
const exerciseUUID = uuidv4()

describe("Integration test for createWorkout for the Workout Service", () => {
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
      dateOfBirth: null
    }

    await ctx.prisma.user.create({
      data: myUser
    })
  })

  test("Should create workout [no exercises]", async () => {
    const workoutUUID = uuidv4()
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      planner_ID: userUUID
    }

    const emptyExercise: Exercise[] = []

    await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, Workout.planner_ID, ctx)).resolves.toEqual(
      "Workout Created."
    )
  })

  test("Should create new workout [With exercises]", async () => {
    const workoutUUID = uuidv4()
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      planner_ID: userUUID
    }

    const Exercise = {
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
    await ctx.prisma.exercise.create({
      data: Exercise
    })

    const fullExercise = [Exercise]

    await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, fullExercise, Workout.planner_ID, ctx)).resolves.toEqual(
      "Workout Created."
    )
  })
})
