import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {UserModule} from '../../../src/user/user.module'
import { UserService} from "../../../src/user/user.service";
import { INestApplication } from '@nestjs/common';
import {ActualPrisma, Context, MockContext} from "../../../context";

let mockCtx: MockContext
let ctx: Context

describe('End point testing of the user subsystem', () => {
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
        await ActualPrisma().prisma.user.deleteMany();
    })

    it(`Testing signUp with valid details, should return status 201`, async () => {
        return request(app.getHttpServer())
            .post('/user/signUp')
            .send({
                "user":{
                    "firstName": "Zelu",
                    "lastName": "Tesema",
                    "email": "zelu2@gmail.com",
                    "userType":"PLANNER",
                    "password": "Zelu2000#"
                }
            })
            .expect(201)
    });

    it(`Testing signup with invalid email, should return status 412`, async () => {
        return request(app.getHttpServer())
            .post('/user/signUp')
            .send({
                "user":{
                    "firstName": "Zelu",
                    "lastName": "Tesema",
                    "email": "zelu2gmail.com",
                    "userType":"PLANNER",
                    "password": "Zelu2000#"
                }
            })
            .expect(412)
    });

    it(`Testing signup with Invalid password, should return status 412`, async () => {
        return request(app.getHttpServer())
            .post('/user/signUp')
            .send({
                "user":{
                    "firstName": "Zelu",
                    "lastName": "Tesema",
                    "email": "zelu2@gmail.com",
                    "userType":"PLANNER",
                    "password": "Zelu2000"
                }
            })
            .expect(412)
    });

    it(`Testing signup with user email that already exists, should return 400`, async () => {

        await ActualPrisma().prisma.user.create({
            data:{
                "firstName": "Zelu",
                "lastName": "Tesema",
                "email": "zelu2@gmail.com",
                "userType":"PLANNER",
                "password": "Zelu2000"
            }
        })

        return request(app.getHttpServer())
            .post('/user/signUp')
            .send({
                "user":{
                    "firstName": "Zelu",
                    "lastName": "Tesema",
                    "email": "zelu2@gmail.com",
                    "userType":"PLANNER",
                    "password": "Zelu2000#"
                }
            })
            .expect(400)

    });


    afterAll(async () => {
        await app.close();
    });
});