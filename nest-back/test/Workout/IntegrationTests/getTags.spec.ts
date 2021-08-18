import { ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"

let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient
const ctx = ActualPrisma()

describe("Integration tests of the getTags function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma, userService)
    await ctx.prisma.tag.deleteMany()
  })

  test("Should receive valid information about all tags", async () => {
    await ctx.prisma.tag.create({
      data: {
        label: "test",
        textColour: "test",
        backgroundColour: "test"
      }
    })

    const tag = [{
      label: "test",
      textColour: "test",
      backgroundColour: "test"
    }]

    const response = await workoutService.getTags(ctx)

    expect(response).toStrictEqual(tag)
  })

  test("No tags created, should throw NotFoundException", async () => {
    await expect(workoutService.getTags(ctx)).rejects.toThrow("No tags were found in the database.")
  })
})
