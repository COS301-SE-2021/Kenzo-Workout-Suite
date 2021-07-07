import * as request from "supertest"
import { Test } from "@nestjs/testing"
import { UserModule } from "../../../src/User/user.module"
import { UserService } from "../../../src/User/user.service"
import { INestApplication } from "@nestjs/common"
import { ActualPrisma, Context } from "../../../context"
import { JwtService } from "@nestjs/jwt"
import { v4 as uuidv4 } from "uuid"
import { userType } from "@prisma/client"
import { WorkoutModule } from "../../../src/Workout/workout.module"

let ctx: Context
let userServ: UserService
let Jwt : JwtService
const userUUID = uuidv4()
const workoutUUID = uuidv4()
const myUser = {
  userID: userUUID,
  email: "test@gmail.com",
  firstName: "test",
  lastName: "tester",
  password: "Test123*",
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

    await ctx.prisma.user.create({
      data: myUser
    })
  })

  it("DeleteWorkout endpoint with valid data, should return 200", async () => {
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: userUUID
    }

    const created = await ctx.prisma.workout.create({
      data: Workout
    })

    await userServ.login(myUser)
    return request(app.getHttpServer())
      .delete("/workout/deleteWorkout")
      .send({
        workoutID: created.workoutID
      })
      .expect(200)
  })

  it("DeleteWorkout endpoint with invalid data, should return 404", async () => {
    const Workout = {
      workoutID: workoutUUID,
      workoutTitle: "Test",
      workoutDescription: "Test",
      plannerID: userUUID
    }

    await ctx.prisma.workout.create({
      data: Workout
    })

    await userServ.login(myUser)
    return request(app.getHttpServer())
      .delete("/workout/deleteWorkout")
      .send({
        workoutID: "TestFail"
      })
      .expect(404)
  })
})
