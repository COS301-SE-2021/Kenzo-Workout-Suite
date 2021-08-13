import { WorkoutService } from "../../../src/Workout/workout.service"
import { PrismaClient } from "@prisma/client/scripts/default-index"

let workoutService: WorkoutService
let prisma: PrismaClient

describe("Unit tests textToSpeech functionality", () => {
  beforeEach(() => {
    workoutService = new WorkoutService(prisma)
  })

  test("text passed in", async () => {
    // spyOn(gtts, "save").and.returnValue()
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
