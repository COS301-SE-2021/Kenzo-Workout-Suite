import { Context, ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

describe("Integration tests of the createTag function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma)
    ctx = ActualPrisma()
    await ctx.prisma.tag.deleteMany()
  })

  test("Valid tag passed in, should receive successful message", async () => {
    const tag = {
      label: "Test",
      textColour: "test",
      backgroundColour: "test"
    }

    spyOn(workoutService, "format").and.returnValue("Test")

    const response = await workoutService.createTag("Test", "test", "test", ctx)

    expect(response).toStrictEqual(tag)
  })

  test("Valid tag passed in with inappropriate label, should receive error message", async () => {
    await expect(workoutService.createTag("Sh!t", "test", "test", ctx)).rejects.toThrow("Profanity contained in label title.")
  })

  test("Null tag passed in, should throw PreconditionFailedException", async () => {
    await expect(workoutService.createTag("", "", "", ctx)).rejects.toThrow("Parameters can not be left empty.")
  })

  test("Invalid tag parameters passed in, should throw PreconditionFailedException", async () => {
    await expect(workoutService.createTag("test", "", "test", ctx)).rejects.toThrow("Parameters can not be left empty.")
  })

  test("Duplicate tag passed in, should throw ConflictException", async () => {
    await ctx.prisma.tag.create({
      data: {
        label: "test",
        textColour: "test",
        backgroundColour: "test"
      }
    })
    await expect(workoutService.createTag("test", "test", "test", ctx)).rejects.toThrow("Duplicate")
  })
})
