import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import { Test, TestingModule } from '@nestjs/testing';
import {v4 as uuidv4 } from 'uuid';
import {
    Workout,
    Exercise,
    User,
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

test('Should create new workout ', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "postmanTest",
        workoutDescription: "postmanMoreTest",
        difficulty: Difficulty.EASY,
        planner_Email: "null"
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);

    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription, Workout.difficulty, Workout.planner_Email,ctx)).resolves.toEqual(
        "Workout Created."
    )
})

test('Should not create workout [Throws Empty Parameters error(Title)] ', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "",
        workoutDescription: "postmanMoreTest",
        difficulty: Difficulty.EASY,
        planner_Email: "null"
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);

    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription, Workout.difficulty, Workout.planner_Email,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not create workout [Throws Empty Parameters error(Description)] ', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "postmanMoreTest",
        workoutDescription: "",
        difficulty: Difficulty.EASY,
        planner_Email: "null"
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);

    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription, Workout.difficulty, Workout.planner_Email,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not create workout [Throws Empty Parameters error(Both String Inputs)] ', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "",
        workoutDescription: "",
        difficulty: Difficulty.HARD,
        planner_Email: "null"
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);

    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription, Workout.difficulty, Workout.planner_Email,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})