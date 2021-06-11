import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
//import { Test, TestingModule } from '@nestjs/testing';
import {v4 as uuidv4 } from 'uuid';
import {
    Workout,
    Exercise,
    //User,
    Difficulty,
    Prisma
} from '@prisma/client';

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService

beforeEach(() => {
    workoutService = new WorkoutService;
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('Should receive valid information about all workouts', async () => {
    //mockCtx.prisma.workout.findMany.mockResolvedValue()
})