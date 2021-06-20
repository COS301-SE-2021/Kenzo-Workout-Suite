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

test('Should receive valid information about all workouts', async () => {
    const workout = [{
        workoutID: uuidv4(),
        workoutTitle: "test",
        workoutDescription: "test",
        tags: [],
        planner_ID: uuidv4()
    }]
    mockCtx.prisma.workout.findMany.mockResolvedValue(workout)

    const response=await workoutService.getWorkouts(ctx)

    expect(response).toBe(workout);
})