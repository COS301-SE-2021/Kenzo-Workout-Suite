import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';
import {PrismaClient} from "@prisma/client/scripts/default-index";

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

describe('Unit tests of the getExerciseByTitle function in the Workout Service', () => {

    beforeEach(() => {
        workoutService = new WorkoutService(prisma);
        mockCtx = createMockContext()
        ctx = (mockCtx as unknown) as Context
    })

    test('Should receive valid information about exercise with corresponding title', async () => {

        const Exercise = [{
            exercise: uuidv4(),
            title: "TestExercise",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "TestPDesc",
            restPeriod: 2,
            tags: [],
            duratime: 2,
            workouts: null,
            planner_ID: ""
        }]

        mockCtx.prisma.exercise.findMany.mockResolvedValue(Exercise)

        const response = await workoutService.getExerciseByTitle("TestExercise", ctx)

        expect(response).toBe(Exercise);
    })

    test('Should not receive valid information about exercise with corresponding title as workout does not exist', async () => {
        let Exercise;
        mockCtx.prisma.exercise.findMany.mockResolvedValue(Exercise)
        await expect(workoutService.getExerciseByTitle("", ctx)).rejects.toThrow("No exercises were found in the database with the specified title.")
    })

})