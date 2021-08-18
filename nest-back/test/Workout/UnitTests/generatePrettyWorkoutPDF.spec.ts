import { MockContext, Context, createMockContext } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"
import { userType } from "@prisma/client"

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
describe("Unit tests for generatePrettyWorkoutPDF in workout subsystem", () => {
  test("Should Generate WorkoutPDF", async () => {
    const userUUID = uuidv4()
    const myUser = {
      userID: userUUID,
      email: "test@gmail.com",
      firstName: "test",
      lastName: "tester",
      password: "thePassword",
      userType: userType.PLANNER,
      dateOfBirth: null
    }
    const Workout = {
      workoutID: uuidv4(),
      workoutTitle: "Test",
      workoutDescription: "Test",
      planner_ID: uuidv4()
    }
    mockCtx.prisma.user.create.mockResolvedValue(myUser)
    spyOn(workoutService, "generatePrettyWorkoutPDF").and.stub()
    expect(await workoutService.generatePrettyWorkoutPDF(Workout, ctx)).toEqual(undefined)
  })
  test("Should not Generate WorkoutPDF [Precondition Exception]", async () => {
    let workout
    await expect(workoutService.generatePrettyWorkoutPDF(workout, ctx)).rejects.toThrow("Could not generate workout PDF.")
  })
})
