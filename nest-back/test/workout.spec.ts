import { MockContext, Context, createMockContext } from '../context'
import {WorkoutService} from "../src/Workout/workout.service";
import {WorkoutController} from "../src/Workout/workout.controller";
import { Test, TestingModule } from '@nestjs/testing';
import {v4 as uuidv4 } from 'uuid';
import { AppController} from "../src/app.controller";
import { AppService} from "../src/app.service";
import {
    Workout,
    Exercise,
    Planner,
    Difficulty,
    Prisma
} from '@prisma/client';
import {randomUUID} from "crypto";
import {WorkoutModule} from "../src/Workout/workout.module";
import {executionAsyncResource} from "async_hooks";

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('should create new workout ', async () => {
    const Workout = {
        workoutID: "85171627-7245-4a0c-9fa3-a00c9683bdbf",
        workoutTitle: "postmanTest",
        workoutDescription: "postmanMoreTest",
        difficulty: Difficulty.EASY,
        planner_Email: null
    }

    mockCtx.prisma.workout.create.mockResolvedValue(Workout);
    let fWorkout = await WorkoutService.createWorkout("Workout.workoutTitle",Workout.workoutDescription, Workout.difficulty,ctx);
    console.log(fWorkout.workoutTitle);
    //console.log(WorkoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription, Workout.difficulty,ctx));
    // await expect(WorkoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription, Workout.difficulty,ctx)).resolves.toEqual(
    //    "Workout Created."
    // )
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

    await expect(WorkoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).resolves.toEqual(
        "Exercise created."
    )
})

describe('Should do the work', () => {
    let workoutController: WorkoutController;
    const Workout = {
        workoutTitle: "TestMock",
        workoutDescription: 'TestMock',
        difficulty: Difficulty.EASY,
        planner_Email: "test@Test.com"
    }

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [WorkoutModule],
            controllers: [WorkoutController],
            providers: [WorkoutService],
        }).compile();

        workoutController = app.get<WorkoutController>(WorkoutController);
    });

    describe('Create Workout', () => {
        it('should return "Workout created."', () => {
            expect(workoutController.createWorkout(Workout.workoutTitle,Workout.workoutDescription, Workout.difficulty,ctx)).toBe('Workout created.');
        });
    });
});





