import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
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

test("Should resolve addition of tags.", async () => {
  const tagArray: Tag[] = [{ label: "painful", textColour: "blue", backgroundColour: "white" }]
  mockCtx.prisma.tag.count.mockResolvedValue(0)
  spyOn(workoutService, "createTag").and.returnValue(tagArray)
  await expect(workoutService.addNewTags(tagArray, ctx)).resolves
})

test("Should not resolve the addition of tags.", async () => {
  const tagArray: Tag[] = []
  mockCtx.prisma.tag.count.mockResolvedValue(0)
  spyOn(workoutService, "createTag").and.returnValue(tagArray)
  await expect(workoutService.addNewTags(tagArray, ctx)).rejects.toThrow("Cannot work with empty tags.")
})
