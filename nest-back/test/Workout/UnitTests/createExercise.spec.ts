import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import {
  Tag
} from "@prisma/client"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

beforeEach(() => {
  workoutService = new WorkoutService(prisma, userService)
  mockCtx = createMockContext()
  ctx = (mockCtx as unknown) as Context
})

describe("Unit tests for createExercise in workout subsystem", () => {
  const empty: Tag[] = []
  const imagesArray:string[] = ["data:image/jpeg;base64,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"]

  test("Should create new Exercise without Tags", async () => {
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
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)
    spyOn(workoutService, "getExerciseByID").and.stub()
    spyOn(workoutService, "saveImagesToJSON").and.stub()

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, imagesArray, ctx)).resolves.toEqual(
      "Exercise created."
    )
  })

  test("Should create new Exercise With Tags", async () => {
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
    const tagArray: Tag[] = [{ label: "painful", textColour: "blue", backgroundColour: "white" }]
    spyOn(workoutService, "addNewTags")
    spyOn(workoutService, "createTag").and.returnValue(tagArray)
    spyOn(workoutService, "getExerciseByID").and.stub()
    spyOn(workoutService, "saveImagesToJSON").and.stub()
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, tagArray, Exercise.duration, Exercise.plannerID, imagesArray, ctx)).resolves.toEqual(
      "Exercise created."
    )
  })

  test("Should not create exercise, [Throws Empty Parameters error(exerciseTitle)]  ", async () => {
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
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)
    const empty: Tag[] = []

    await expect(workoutService.createExercise("", Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, imagesArray, ctx)).rejects.toThrow(
      "Parameters can not be left empty!"
    )
  })

  test("Should not create exercise, [Throws Empty Parameters error(Description)]  ", async () => {
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
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)
    const empty: Tag[] = []

    await expect(workoutService.createExercise(Exercise.exerciseTitle, "", Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, imagesArray, ctx)).rejects.toThrow(
      "Parameters can not be left empty!"
    )
  })

  test("Should not create exercise, [Throws Empty Parameters error(poseDescription)]  ", async () => {
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
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)
    const empty: Tag[] = []

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, "", Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, imagesArray, ctx)).rejects.toThrow(
      "Parameters can not be left empty!"
    )
  })
})
