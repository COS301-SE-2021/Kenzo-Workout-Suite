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
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient
const workoutUUID = uuidv4()
const plannerUUID = uuidv4()

beforeEach(() => {
  workoutService = new WorkoutService(prisma, userService)
  mockCtx = createMockContext()
  ctx = (mockCtx as unknown) as Context
})
describe("Unit tests for updateWorkout in workout subsystem", () => {
  test("Should update new workout [Without Exercises]", async () => {
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: plannerUUID
    }
    const emptyExercise: Exercise[] = []
    mockCtx.prisma.workout.create.mockResolvedValue(Workout)
    mockCtx.prisma.workout.update.mockResolvedValue(Workout)
    spyOn(workoutService, "getWorkoutById").and.stub()
    spyOn(workoutService, "generatePrettyWorkoutPDF").and.stub()
    await expect(workoutService.updateWorkout(workoutUUID, "Test", "test", emptyExercise, plannerUUID, mockCtx)).resolves.toEqual(
      "Workout Updated."
    )
  })

  test("Should create new workout [With Exercises]", async () => {
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: plannerUUID
    }
    const exerciseUUID = uuidv4()
    const userUUID = uuidv4()
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

    const fullExercise: Exercise[] = [Exercise]
    mockCtx.prisma.workout.create.mockResolvedValue(Workout)
    mockCtx.prisma.workout.update.mockResolvedValue(Workout)
    spyOn(workoutService, "getWorkoutById").and.stub()
    spyOn(workoutService, "generatePrettyWorkoutPDF").and.stub()

    await expect(workoutService.updateWorkout(workoutUUID, "Test", "test", fullExercise, userUUID, mockCtx)).resolves.toEqual(
      "Workout Updated."
    )
  })

  test("Should not update workout, [Throws Empty Parameters error(workoutTitle)]  ", async () => {
    let workout

    const emptyExercise: Exercise[] = []
    mockCtx.prisma.tag.update.mockResolvedValue(workout)
    spyOn(workoutService, "generatePrettyWorkoutPDF").and.stub()
    await expect(workoutService.updateWorkout(uuidv4(), "", "test", emptyExercise, uuidv4(), ctx)).rejects.toThrow(
      "Parameters can not be left empty."
    )
  })

  test("Should not update workout, [Throws Empty Parameters error(workoutDescription)]  ", async () => {
    let workout

    const emptyExercise: Exercise[] = []
    mockCtx.prisma.tag.update.mockResolvedValue(workout)
    spyOn(workoutService, "generatePrettyWorkoutPDF").and.stub()
    await expect(workoutService.updateWorkout(uuidv4(), "test", "", emptyExercise, uuidv4(), ctx)).rejects.toThrow(
      "Parameters can not be left empty."
    )
  })
})
