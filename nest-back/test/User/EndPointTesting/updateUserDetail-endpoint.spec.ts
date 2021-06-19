import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {UserModule} from '../../../src/User/user.module'
import { UserService} from "../../../src/User/user.service";
import { INestApplication } from '@nestjs/common';
import {ActualPrisma, Context, MockContext} from "../../../context";
import {JwtService} from "@nestjs/jwt";

let mockCtx: MockContext
let ctx: Context
let userServ: UserService
let Jwt : JwtService

describe('End point testing of the User subsystem', () => {
    let app: INestApplication;
    let userService = { findAll: () => ['test'] };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

    });

    beforeEach(async () => {
        Jwt=new JwtService({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.EXPIRY_TIME },
        })
        userServ=new UserService(Jwt)
        await ActualPrisma().prisma.user.deleteMany();
    })

    it(`UpdateUserDetail endpoint with valid data, should return 200`, async () => {

        await ActualPrisma().prisma.user.deleteMany();

        const user= await ActualPrisma().prisma.user.create({
            data:{
                "firstName": "Zelu",
                "lastName": "Tesema",
                "email": "zelu2@gmail.com",
                "userType":"PLANNER",
                "password": "Zelu2000"
            }
        })


        const response= await userServ.login(user)
        const accesstoken= response.access_token

        return request(app.getHttpServer())
            .put('/User/updateUserDetail')
            .set("Authorization","Bearer " + accesstoken)
            .send({
                "firstName" : "updatedFirstName",
                "lastName" : "updatedSecondName",
                "dateOfBirth" : null
            })
            .expect(200)

    });

    it(`Testing updateUserDetail with invalid data, should return 401`, async () => {

        await ActualPrisma().prisma.user.deleteMany();

        const user= await ActualPrisma().prisma.user.create({
            data:{
                "firstName": "Zelu",
                "lastName": "Tesema",
                "email": "zelu2@gmail.com",
                "userType":"PLANNER",
                "password": "Zelu2000"
            }
        })


        const response= await userServ.login(user)
        const accesstoken= "invalidaccesstoken"

        return request(app.getHttpServer())
            .put('/User/updateUserDetail')
            .set("Authorization","Bearer " + accesstoken)
            .send({
                "firstName" : "updatedFirstName",
                "lastName" : "updatedSecondName",
                "dateOfBirth" : null
            })
            .expect(401)

    });

    it(`Testing update userdetail endpoint with valid data including a non-null date, should return status 200`, async () => {

        await ActualPrisma().prisma.user.deleteMany();

        const user= await ActualPrisma().prisma.user.create({
            data:{
                "firstName": "Zelu",
                "lastName": "Tesema",
                "email": "zelu2@gmail.com",
                "userType":"PLANNER",
                "password": "Zelu2000"
            }
        })


        const response= await userServ.login(user)
        const accesstoken= response.access_token

        return request(app.getHttpServer())
            .put('/User/updateUserDetail')
            .set("Authorization","Bearer " + accesstoken)
            .send({
                "firstName" : "updatedFirstName",
                "lastName" : "updatedSecondName",
                "dateOfBirth" : new Date("2019-01-16")
            })
            .expect(200)
    });

    afterAll(async () => {
        await app.close();
    });
});