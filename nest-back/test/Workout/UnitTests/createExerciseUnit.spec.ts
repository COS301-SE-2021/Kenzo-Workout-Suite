import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
//import { Test, TestingModule } from '@nestjs/testing';
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



test('should create new exercise ', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"TestExercise",
        description:"TestDescription",
        repRange:"TestRange",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        difficulty:Difficulty.EASY,

        duratime:2,
        workoutWorkoutID: null
    }
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).resolves.toEqual(
        "Exercise created."
    )
})