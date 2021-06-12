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

beforeEach(async () => {
    workoutService = new WorkoutService(prisma);
    ctx = ActualPrisma()
    await ctx.prisma.workout.deleteMany();
    await ctx.prisma.workout.create({
        data:{
            workoutID: uuidv4(),
            workoutTitle: "test",
            workoutDescription: "test",
            difficulty: Difficulty.EASY,
            planner_Email: "test@gmail.com"
        }
    });
})

test('Should receive valid information about workout with corresponding title', async () => {
    const workout = [{
        workoutTitle: "test",
        workoutDescription: "test",
        exercises:[],
        difficulty: Difficulty.EASY,
        planner_Email: "test@gmail.com"
    }]

    const response=await workoutService.getWorkoutByTitle("test", ctx)

    expect(response).toStrictEqual(workout);
})

test('Should not receive valid information about workout with corresponding title as workout does not exist', async () => {
    expect(workoutService.getWorkoutByTitle("",ctx)).rejects.toThrow("No workouts were found in the database with the specified title.")
})