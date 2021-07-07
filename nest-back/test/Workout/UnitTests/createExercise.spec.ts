import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import {
  Tag
} from "@prisma/client"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

beforeEach(() => {
  workoutService = new WorkoutService(prisma)
  mockCtx = createMockContext()
  ctx = (mockCtx as unknown) as Context
})

describe("Unit tests for createExercise in workout subsystem", () => {
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
    const empty: Tag[] = []

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, ctx)).resolves.toEqual(
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
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, tagArray, Exercise.duration, Exercise.plannerID, ctx)).resolves.toEqual(
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

    await expect(workoutService.createExercise("", Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, ctx)).rejects.toThrow(
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

    await expect(workoutService.createExercise(Exercise.exerciseTitle, "", Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, ctx)).rejects.toThrow(
      "Parameters can not be left empty!"
    )
  })

  test("Should not create exercise, [Throws Empty Parameters error(repRange)]  ", async () => {
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

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, "", Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, ctx)).rejects.toThrow(
      "Parameters can not be left empty!"
    )
  })

  test("Should not create exercise, [Throws Empty Parameters error(Sets)]  ", async () => {
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

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, 0, Exercise.poseDescription, Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, ctx)).rejects.toThrow(
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

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, "", Exercise.restPeriod, empty, Exercise.duration, Exercise.plannerID, ctx)).rejects.toThrow(
      "Parameters can not be left empty!"
    )
  })

  test("Should not create exercise, [Throws Empty Parameters error(restPeriod)]  ", async () => {
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

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, 0, empty, Exercise.duration, Exercise.plannerID, ctx)).rejects.toThrow(
      "Parameters can not be left empty!"
    )
  })

  test("Should not create exercise, [Throws Empty Parameters error(duration/duration)]  ", async () => {
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

    await expect(workoutService.createExercise(Exercise.exerciseTitle, Exercise.exerciseDescription, Exercise.repRange, Exercise.sets, Exercise.poseDescription, Exercise.restPeriod, empty, 0, Exercise.plannerID, ctx)).rejects.toThrow(
      "Parameters can not be left empty!"
    )
  })
})
