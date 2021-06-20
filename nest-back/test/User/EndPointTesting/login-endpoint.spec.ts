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

    it(`Testing login endpoint with valid data, should return status 404`, async () => {

        const user= await ctx.prisma.user.create({
            data:{
                "firstName": "Zelu",
                "lastName": "Tesema",
                "email": "zelu2@gmail.com",
                "userType":"PLANNER",
                "password": "Zelu2000#"
            }
        })

       let users= await ctx.prisma.user.findMany();

        return request(app.getHttpServer())
            .post('/User/login')
            .send({
                "username": "zelu20@gmail.com",
                "password": "Zelu2000#"
            })
            .expect(404)


    });



    afterAll(async () => {
        await app.close();
    });
});