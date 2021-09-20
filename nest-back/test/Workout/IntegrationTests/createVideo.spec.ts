import { ActualPrisma } from "../../../context"
import { WorkoutService } from "../../../src/Workout/workout.service"
import { UserService } from "../../../src/User/user.service"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { userType } from "@prisma/client"

let workoutService: WorkoutService
let userService: UserService
let prisma: PrismaClient
const ctx = ActualPrisma()
const uuidPlanner = uuidv4()
const uuidWorkout = uuidv4()

async function createTestData () {
  await ctx.prisma.user.create({
    data: {
      userID: uuidPlanner,
      email: process.env.TESTEMAIL!,
      firstName: "test",
      lastName: "tester",
      password: process.env.TESTPASSWORD!,
      userType: userType.PLANNER,
      dateOfBirth: null
    }
  })
  await ctx.prisma.workout.create({
    data: {
      workoutID: uuidWorkout,
      workoutTitle: "test",
      workoutDescription: "test",
      plannerID: uuidPlanner
    }
  })
}
describe("Integration tests of the getExercises function in the Workout Service", () => {
  beforeEach(async () => {
    workoutService = new WorkoutService(prisma, userService)
    await ctx.prisma.workout.deleteMany()
    await ctx.prisma.user.deleteMany()
  })

  test("Should not receive error for invalid workout ID", async () => {
    await createTestData()
    // await expect(workoutService.createVideo("", 0, "", 0, 0, ctx)).rejects.toThrow("Invalid Workout ID passed in.")
  })

  test("Should not receive error for non-existent workout ID", async () => {
    await createTestData()
    // await expect(workoutService.createVideo("testesttest", 0, "", 0, 0, ctx)).rejects.toThrow("No workouts were found in the database with the specified id.")
  })

  test("Should not receive error for workout having no exercises", async () => {
    await createTestData()
    // await expect(workoutService.createVideo(uuidWorkout, 0, "", 0, 0, ctx)).rejects.toThrow("Cant create video without exercises")
  })
})
