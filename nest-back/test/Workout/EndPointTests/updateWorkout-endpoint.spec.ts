import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {UserModule} from '../../../src/User/user.module'
import { UserService} from "../../../src/User/user.service";
import { INestApplication } from '@nestjs/common';
import {ActualPrisma, Context, MockContext} from "../../../context";
import {JwtService} from "@nestjs/jwt";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {PrismaService} from "../../../src/Prisma/prisma.service";
import {v4 as uuidv4} from "uuid";
import {Exercise, Tag, userType} from "@prisma/client";
import {WorkoutModule} from "../../../src/Workout/workout.module";

let mockCtx: MockContext
let ctx: Context
let userServ: UserService
let workoutService: WorkoutService
let Jwt : JwtService
let prisma : PrismaService;
let userUUID=uuidv4();
let exerciseUUID=uuidv4();
let workoutUUID =uuidv4();
const myUser={
    userId:userUUID,
    email: "test@gmail.com",
    firstName: "test",
    lastName: "tester",
    password:"Test123*",
    userType: userType.PLANNER,
    dateOfBirth: null
}



describe('End point testing of the Workout subsystem', () => {
    let app: INestApplication;
    let userService = { findAll: () => ['test'] };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [UserModule,WorkoutModule]
        }).compile();
        ctx = ActualPrisma();
        app = moduleRef.createNestApplication();
        await app.init();

    });

    beforeEach(async () => {

        Jwt=new JwtService({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.EXPIRY_TIME },
        })
        userServ=new UserService(Jwt);
        workoutService = new WorkoutService(prisma);
        await ctx.prisma.user.deleteMany();
        await ctx.prisma.exercise.deleteMany();
        await ctx.prisma.workout.deleteMany();

        await ctx.prisma.user.create({
            "data":myUser
        })


    })

    it(`Update Workout endpoint with valid data, should return 201`, async () => {

        const Workout = {
            workoutID: workoutUUID,
            workoutTitle: "Test",
            workoutDescription: "Test",
            planner_ID: userUUID
        }

        let created = await ctx.prisma.workout.create({
            "data": Workout
        });

        const response= await userServ.login(myUser);
        const accessToken= response.access_token;
        let emptyTag: Tag[] = [];
        let emptyExercise: Exercise[] = [];
        return request(app.getHttpServer())
            .put('/workout/updateWorkout')
            .set("Authorization","Bearer " + accessToken)
            .send({
                "workoutID": workoutUUID,
                "workoutTitle": "TestUpdate",
                "workoutDescription": "TestUpdate",
                "exercises":emptyExercise,
                "tags":emptyTag
            })
            .expect(200)
    });

    it(`Update Workout endpoint with invalid data, should return 201`, async () => {

        const Workout = {
            workoutID: workoutUUID,
            workoutTitle: "Test",
            workoutDescription: "Test",
            planner_ID: userUUID
        }

        let created = await ctx.prisma.workout.create({
            "data": Workout
        });

        const response= await userServ.login(myUser);
        const accessToken= response.access_token;
        let emptyTag: Tag[] = [];
        let emptyExercise: Exercise[] = [];
        return request(app.getHttpServer())
            .put('/workout/updateWorkout')
            .set("Authorization","Bearer " + accessToken)
            .send({
                "workoutID": workoutUUID,
                "workoutTitle": "TestUpdate",
                "workoutDescription": "TestUpdate",
                "exercises":emptyExercise,
                "tags":emptyTag
            })
            .expect(200)
    });


});