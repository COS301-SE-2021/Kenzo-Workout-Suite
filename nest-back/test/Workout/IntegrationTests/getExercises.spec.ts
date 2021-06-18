import {MockContext, Context, createMockContext, ActualPrisma} from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';

import {
    Difficulty, userType
} from '@prisma/client';
import {PrismaClient} from "@prisma/client/scripts/default-index";

let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient
const uuidExercise = uuidv4();

beforeEach(async () => {
    workoutService = new WorkoutService(prisma);
    ctx = ActualPrisma()
    await ctx.prisma.exercise.deleteMany();
    await ctx.prisma.exercise.create({
        data:{
            exercise:uuidExercise,
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
        exercise: uuidExercise,
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