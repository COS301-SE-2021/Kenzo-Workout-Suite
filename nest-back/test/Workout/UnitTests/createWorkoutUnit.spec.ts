import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import { Test, TestingModule } from '@nestjs/testing';
import {v4 as uuidv4 } from 'uuid';
import {
    Workout,
    Exercise,
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

test('should create new workout ', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "postmanTest",
        workoutDescription: "postmanMoreTest",
        difficulty: Difficulty.EASY,
        planner_Email: null
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);

    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription, Workout.difficulty,ctx)).resolves.toEqual(
        "Workout Created."
    )
})