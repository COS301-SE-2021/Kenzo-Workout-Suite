import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { UserService } from "../../../src/User/user.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient

describe("Unit tests of the updateExercise function in the Workout Service", () => {
  const images:string[] = ["base64line"]
  beforeEach(() => {
    workoutService = new WorkoutService(prisma, userService)
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
  })

  test("Null exercise passed in, should throw PreconditionFailedException", async () => {
    let exercise
    mockCtx.prisma.tag.update.mockResolvedValue(exercise)
    spyOn(workoutService, "getExerciseByID").and.stub()
    spyOn(workoutService, "saveExerciseImages").and.stub()
    spyOn(workoutService, "textToSpeech").and.stub()
    await expect(workoutService.updateExercise("", "", "", "", 0, "", 0, [], 0, "", images, ctx)).rejects.toThrow("Invalid exercise object passed in.")
  })

  test("Incomplete exercise passed in, should throw PreconditionFailedException", async () => {
    let exercise
    mockCtx.prisma.tag.update.mockResolvedValue(exercise)
    spyOn(workoutService, "getExerciseByID").and.stub()
    spyOn(workoutService, "saveExerciseImages").and.stub()
    spyOn(workoutService, "textToSpeech").and.stub()
    await expect(workoutService.updateExercise("test", "", "test", "", 0, "test", 0, [], 0, "", images, ctx)).rejects.toThrow("Invalid exercise object passed in.")
  })

  test("Nonexistent exercise, should throw NotFoundException", async () => {
    let exercise
    mockCtx.prisma.tag.update.mockResolvedValue(exercise)
    spyOn(workoutService, "getExerciseByID").and.stub()
    spyOn(workoutService, "saveExerciseImages").and.stub()
    spyOn(workoutService, "textToSpeech").and.stub()
    await expect(workoutService.updateExercise("test", "test", "test", "test", 0, "test", 0, [], 0, "", images, ctx)).rejects.toThrow("Invalid exercise object passed in.")
  })
})
