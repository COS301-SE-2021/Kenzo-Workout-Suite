import * as request from "supertest"
import { Test } from "@nestjs/testing"
import { UserModule } from "../../../src/User/user.module"
import { UserService } from "../../../src/User/user.service"
import { INestApplication } from "@nestjs/common"
import { ActualPrisma, Context } from "../../../context"
import { JwtService } from "@nestjs/jwt"
import { v4 as uuidv4 } from "uuid"
import { Exercise, userType } from "@prisma/client"
import { WorkoutModule } from "../../../src/Workout/workout.module"

let ctx: Context
let userServ: UserService
let Jwt : JwtService
const userUUID = uuidv4()
const workoutUUID = uuidv4()
const exerciseUUID = uuidv4()
const myUser = {
  userID: userUUID,
  email: process.env.TESTEMAIL!,
  firstName: "test",
  lastName: "tester",
  password: process.env.TESTPASSWORD!,
  userType: userType.PLANNER,
  dateOfBirth: null
}

describe("End point testing of the Workout subsystem", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule, WorkoutModule]
    }).compile()
    ctx = ActualPrisma()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  beforeEach(async () => {
    Jwt = new JwtService({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRY_TIME }
    })
    userServ = new UserService(Jwt)
    await ctx.prisma.user.deleteMany()
    await ctx.prisma.exercise.deleteMany()
    await ctx.prisma.workout.deleteMany()
  })

  it("Update Workout endpoint with invalid data, should return 404", async () => {
    await ctx.prisma.user.create({
      data: myUser
    })
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: userUUID
    }

    await ctx.prisma.workout.create({
      data: Workout
    })
    const exercise = {
      exerciseID: exerciseUUID,
      exerciseTitle: "TestExercise",
      exerciseDescription: "TestDescription",
      repRange: "TestRange",
      sets: 4,
      poseDescription: "TestPDesc",
      restPeriod: 2,
      duration: 2,
      plannerID: userUUID
    }
    await ctx.prisma.exercise.create({
      data: exercise
    })
    const response = await userServ.login(myUser)
    const accessToken = response.access_token

    const fullExercise: Exercise[] = [exercise]
    return request(app.getHttpServer())
      .put("/workout/updateWorkout")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        workoutID: workoutUUID,
        workoutTitle: "TestUpdate",
        workoutDescription: "TestUpdate",
        exercises: fullExercise,
        loop: 0,
        songChoice: "chill",
        resolutionWidth: 1920,
        resolutionHeight: 1080
      })
      .expect(404)
  })
})
