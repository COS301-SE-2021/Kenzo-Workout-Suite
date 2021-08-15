import { WorkoutService } from "../../../src/Workout/workout.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"
import { UserService } from "../../../src/User/user.service"
let userService: UserService
let workoutService: WorkoutService
let prisma: PrismaClient

describe("Unit tests textToSpeech functionality", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma, userService)
  })

  test("text passed in", async () => {
    const response = await workoutService.textToSpeech("This is the test string", "testFile")

    expect(response).toStrictEqual("text file has been created")
  })

  test("text passed in", async () => {
    await expect(workoutService.textToSpeech("", "testFile")).rejects.toThrow("Could not generate text to speech")
  })

  test("text passed in", async () => {
    const response = await workoutService.textToSpeech("This is the test string", "")

    expect(response).toStrictEqual("text file has been created")
  })
})
