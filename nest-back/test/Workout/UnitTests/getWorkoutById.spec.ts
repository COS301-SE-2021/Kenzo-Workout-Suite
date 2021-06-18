import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
//import { Test, TestingModule } from '@nestjs/testing';
import {v4 as uuidv4 } from 'uuid';
import {
    Workout,
    Exercise,
    Prisma, Difficulty
} from '@prisma/client';
import {PrismaClient} from "@prisma/client/scripts/default-index";

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient
const uuidWorkout = uuidv4();

beforeEach(() => {
    workoutService = new WorkoutService(prisma);
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('Should receive valid information about workout with corresponding id', async () => {
    const workout = [{
        workoutID: uuidWorkout,
        workoutTitle: "test",
        workoutDescription: "test",
        difficulty: Difficulty.EASY,
        planner_ID: uuidv4()
    }]
    mockCtx.prisma.workout.findMany.mockResolvedValue(workout)

    const response=await workoutService.getWorkoutById(uuidWorkout,ctx)

    expect(response).toBe(workout);
})

test('Should not receive valid information about workout with corresponding id as workout does not exist', async () => {
    let workout;
    mockCtx.prisma.workout.findUnique.mockResolvedValue(workout)
    await expect(workoutService.getWorkoutById("",ctx)).rejects.toThrow("No workouts were found in the database with the specified id.")
})