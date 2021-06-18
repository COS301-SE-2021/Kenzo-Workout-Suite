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
    await ctx.prisma.exercise.deleteMany();
    await ctx.prisma.exercise.create({
        data:{
            exercise:uuidv4(),
            title:"TestExercise",
            description:"TestDescription",
            repRange:"TestRange",
            sets:4,
            Posedescription:"TestPDesc",
            restPeriod:2,
            difficulty:Difficulty.EASY,
            duratime:2
        }
    });
})

test('Should receive valid information about all exercises', async () => {
    const Exercise = [{
        title:"TestExercise",
        description:"TestDescription",
        repRange:"TestRange",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        difficulty:Difficulty.EASY,
        duratime:2,
    }]

    const response=await workoutService.getExercises(ctx)

    expect(response).toStrictEqual(Exercise);
})