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

    await ctx.prisma.user.create({
      data: myUser
    })
  })

  it("CreateWorkout endpoint with valid data, should return 201", async () => {
    const response = await userServ.login(myUser)
    const accessToken = response.access_token
    const emptyExercise: Exercise[] = []
    return request(app.getHttpServer())
      .post("/workout/createWorkout")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        workoutTitle: "Test",
        workoutDescription: "Test",
        exercises: emptyExercise

      })
      .expect(201)
  })

  it("CreateWorkout endpoint with invalid data, should return 412", async () => {
    const response = await userServ.login(myUser)
    const accessToken = response.access_token

    const emptyExercise: Exercise[] = []
    return request(app.getHttpServer())
      .post("/workout/createWorkout")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        workoutTitle: null,
        workoutDescription: "Test",
        exercises: emptyExercise

      })
      .expect(404)
  })
})
