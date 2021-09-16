import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { UserService } from "../../../src/User/user.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import * as FS from "fs"
import * as fs from "fs"
import { v4 as uuidv4 } from "uuid"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

describe("Unit tests of the deleteExercise function in the Workout Service", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma, userService)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Null exercise ID passed in, should throw PreconditionFailedException", async () => {
    let exercise
    mockCtx.prisma.exercise.delete.mockResolvedValue(exercise)
    await expect(workoutService.deleteExercise("", ctx)).rejects.toThrow("Parameter can not be left empty.")
  })

  test("Valid exercise returned should return success message", async () => {
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
    const exerciseImageArray = ["t", "e", "s", "t"]
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)
    spyOn(workoutService, "getExerciseImages").and.returnValue(exerciseImageArray)
    spyOn(workoutService, "getExerciseByID").and.stub()
    mockCtx.prisma.exercise.delete.mockResolvedValue(Exercise)
    spyOn(fs, "unlink").and.stub()
    spyOn(workoutService, "cleanupWorkouts").and.stub()
    expect(await workoutService.deleteExercise(Exercise.exerciseID, ctx)).toStrictEqual("Exercise Deleted.")
  })
})
