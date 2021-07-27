import * as request from "supertest"
import { Test } from "@nestjs/testing"
import { UserModule } from "../../../src/User/user.module"
import { INestApplication } from "@nestjs/common"
import { ActualPrisma, Context } from "../../../context"
let ctx: Context

describe("End point testing of the User subsystem", () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserModule]
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    ctx = ActualPrisma()
  })

  beforeEach(async () => {
    await ctx.prisma.user.deleteMany()
  })

  it("Testing login endpoint with valid data, should return status 404", async () => {
    return request(app.getHttpServer())
      .post("/User/login")
      .send({
        username: "zelu20@gmail.com",
        password: "Zelu2000#"
      })
      .expect(404)
  })

  afterAll(async () => {
    await app.close()
  })
})
