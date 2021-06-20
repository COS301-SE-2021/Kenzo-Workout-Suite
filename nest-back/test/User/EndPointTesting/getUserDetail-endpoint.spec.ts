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

        ctx=ActualPrisma();
    });

    beforeEach(async () => {
        Jwt=new JwtService({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.EXPIRY_TIME },
        })
        userServ=new UserService(Jwt)
        await ctx.prisma.user.deleteMany();
    })

    it(`Testing getUserDetail end point with valid data and authorisation, should return status 200`, async () => {

        await ctx.prisma.user.deleteMany();

       const user= await ctx.prisma.user.create({
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
            .get('/User/getUserDetails')
            .set("Authorization","Bearer " + accesstoken)
            .expect(200)


    });

    it(`Testing getUserDetail end point with valid data and invalid authorisation, should return status 401`, async () => {

        await ctx.prisma.user.deleteMany();
        const accesstoken= "invalid token"

        return request(app.getHttpServer())
            .get('/User/getUserDetails')
            .set("Authorization","Bearer " + accesstoken)
            .expect(401)


    });

    afterAll(async () => {
        await app.close();
    });
});