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

beforeEach(() => {
    workoutService = new WorkoutService(prisma);
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('Should receive valid information about workout with corresponding title', async () => {
    const workout = [{
        workoutID: uuidv4(),
        workoutTitle: "test",
        workoutDescription: "test",
        difficulty: Difficulty.EASY,
        planner_Email: "test@gmail.com"
    }]
    mockCtx.prisma.workout.findMany.mockResolvedValue(workout)

    const response=await workoutService.getWorkoutByTitle("test",ctx)

    expect(response).toBe(workout);
})

test('Should not receive valid information about workout with corresponding title as workout does not exist', async () => {
    await expect(workoutService.getWorkoutByTitle("",ctx)).rejects.toThrow("No workouts were found in the database with the specified title.")
})