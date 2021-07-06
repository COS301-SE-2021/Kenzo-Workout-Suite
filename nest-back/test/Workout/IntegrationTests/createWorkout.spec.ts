import { Context, ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import {
  Exercise,
  userType
} from "@prisma/client"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient
const userUUID = uuidv4()
const exerciseUUID = uuidv4()

describe("Integration test for createWorkout for the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma)
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

  test("Should not create workout [Missing Title - Throws Parameters can not be left empty. ]", async () => {
    const workoutUUID = uuidv4()
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "",
      workoutDescription: "Test",
      planner_ID: userUUID
    }

    const emptyExercise: Exercise[] = []

    await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, Workout.planner_ID, ctx)).rejects.toThrow(
      "Parameters can not be left empty."
    )
  })

  test("Should not create workout [Missing Description - Throws Parameters can not be left empty.]", async () => {
    const workoutUUID = uuidv4()
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "",
      planner_ID: userUUID
    }

    const emptyExercise: Exercise[] = []

    await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, Workout.planner_ID, ctx)).rejects.toThrow(
      "Parameters can not be left empty."
    )
  })
})
