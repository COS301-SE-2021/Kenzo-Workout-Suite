import {MockContext, Context, createMockContext, ActualPrisma} from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import { JwtService } from '@nestjs/jwt';
import {v4 as uuidv4 } from 'uuid';

import {
    Workout,
    Exercise,
    Prisma, Difficulty, userType
} from '@prisma/client';
import {PrismaClient} from "@prisma/client/scripts/default-index";

let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

const uuidPlanner = uuidv4();

beforeEach(async () => {
    workoutService = new WorkoutService(prisma);
    ctx = ActualPrisma()
    await ctx.prisma.workout.deleteMany();
    await ctx.prisma.user.deleteMany();
    await ctx.prisma.user.create({
        data:{
            userId: uuidPlanner,
            email: "test&gmail.com",
            firstName: "test",
            lastName: "test",
            password: "Test123!",
            dateOfBirth: null,
            userType: "PLANNER",
        }
    });
    await ctx.prisma.workout.create({
        data:{
            workoutID: uuidv4(),
            workoutTitle: "test",
            workoutDescription: "test",
            difficulty: Difficulty.EASY,
            planner_ID: uuidPlanner
        }
    });
})

test('Should receive valid information about all workouts', async () => {
    const workout = [{
        workoutTitle: "test",
        workoutDescription: "test",
        exercises:[],
        difficulty: Difficulty.EASY,
        planner_ID: uuidPlanner
    }]

    const response=await workoutService.getWorkouts(ctx)

    expect(response).toStrictEqual(workout);
})