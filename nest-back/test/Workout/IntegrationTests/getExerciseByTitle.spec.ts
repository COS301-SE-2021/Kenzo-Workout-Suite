import {MockContext, Context, createMockContext, ActualPrisma} from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';

import {
    Prisma, Difficulty
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

test('Should receive valid information about exercise with corresponding title', async () => {
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

    const response=await workoutService.getExerciseByTitle("TestExercise",ctx)

    expect(response).toStrictEqual(Exercise);
})

test('Should not receive valid information about exercise with corresponding title as workout does not exist', async () => {
    await expect(workoutService.getExerciseByTitle("",ctx)).rejects.toThrow("No exercises were found in the database with the specified title.")
})