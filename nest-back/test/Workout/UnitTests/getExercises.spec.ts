import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';
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

test('Should receive valid information about all exercises', async () => {
    const Exercise = [{
        exercise:uuidv4(),
        title:"TestExercise",
        description:"TestDescription",
        repRange:"TestRange",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        tags:[],
        duratime:2,
        workouts: null
    }]
    mockCtx.prisma.exercise.findMany.mockResolvedValue(Exercise)

    const response=await workoutService.getExercises(ctx)

    expect(response).toBe(Exercise);
})