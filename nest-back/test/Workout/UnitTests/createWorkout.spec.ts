import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import {
  Exercise
} from "@prisma/client"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"

let mockCtx: MockContext
let ctx: Context
let userService: UserService
let workoutService: WorkoutService
let prisma: PrismaClient

beforeEach(() => {
  workoutService = new WorkoutService(prisma, userService)
  mockCtx = createMockContext()
  ctx = (mockCtx as unknown) as Context
})
describe("Unit tests for createWorkout in workout subsystem", () => {
  test("Should create new workout [Without Exercises]", async () => {
    const Workout = {
      workoutID: uuidv4(),
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: uuidv4()
    }

    const emptyExercise: Exercise[] = []
    spyOn(workoutService, "getWorkoutById").and.stub()
    spyOn(workoutService, "generatePrettyWorkoutPDF").and.stub()
    spyOn(workoutService, "createVideo").and.stub()
    mockCtx.prisma.workout.create.mockResolvedValue(Workout)

    await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, Workout.plannerID, ctx)).resolves.toEqual(
      "Workout Created."
    )
  })

  test("Should create new workout [With Exercises]", async () => {
    const Workout = {
      workoutID: uuidv4(),
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: uuidv4()
    }
    const Exercise = {
      exerciseID: uuidv4(),
      exerciseTitle: "TestExercise",
      exerciseDescription: "TestDescription",
      repRange: "TestRange",
      sets: 4,
      poseDescription: "TestPDesc",
      restPeriod: 2,
      duration: 2,
      plannerID: uuidv4()
    }

    const fullExercise: Exercise[] = [Exercise]
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)
    mockCtx.prisma.workout.create.mockResolvedValue(Workout)
    spyOn(workoutService, "getWorkoutById").and.returnValue(Workout)
    spyOn(workoutService, "generatePrettyWorkoutPDF").and.stub()
    spyOn(workoutService, "createVideo").and.stub()

    await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, fullExercise, Workout.plannerID, ctx)).resolves.toEqual(
      "Workout Created."
    )
  })

  test("Should not create workout, [Throws Empty Parameters error(workoutTitle)]  ", async () => {
    const Workout = {
      workoutID: uuidv4(),
      workoutTitle: "",
      workoutDescription: "Test",
      plannerID: uuidv4()
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout)

    const emptyExercise: Exercise[] = []
    spyOn(workoutService, "getWorkoutById").and.stub()
    spyOn(workoutService, "generatePrettyWorkoutPDF").and.stub()

    await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, Workout.plannerID, ctx)).rejects.toThrow(
      "Parameters can not be left empty."
    )
  })

  test("Should not create workout, [Throws Empty Parameters error(workoutDescription)]  ", async () => {
    const Workout = {
      workoutID: uuidv4(),
      workoutTitle: "Test",
      workoutDescription: "",
      plannerID: uuidv4()
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout)

    const emptyExercise: Exercise[] = []
    spyOn(workoutService, "getWorkoutById").and.stub()
    spyOn(workoutService, "generatePrettyWorkoutPDF").and.stub()

    await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, Workout.plannerID, ctx)).rejects.toThrow(
      "Parameters can not be left empty."
    )
  })
})
