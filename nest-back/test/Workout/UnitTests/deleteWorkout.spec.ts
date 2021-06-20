import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';
import {
    Workout,
    Exercise,
    User,
    Tag,
    Prisma
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

test('Should delete workout', async () => {
    let workout;
    mockCtx.prisma.workout.delete.mockResolvedValue(workout)
    await expect(workoutService.deleteWorkout('invalid',ctx)).resolves.toEqual(
        "Workout Deleted."
    )
})


test('Null exercise ID passed in, should throw PreconditionFailedException', async () => {
    let workout;
    mockCtx.prisma.workout.delete.mockResolvedValue(workout);
    await expect(workoutService.deleteWorkout('',ctx)).rejects.toThrow("Parameters can not be left empty.")
})

