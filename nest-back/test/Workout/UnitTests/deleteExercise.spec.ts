import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';
import {PrismaClient} from "@prisma/client/scripts/default-index";

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

const uuidExercise = uuidv4();

beforeEach(() => {
    workoutService = new WorkoutService(prisma);
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})

test('Null exercise ID passed in, should throw PreconditionFailedException', async () => {
    let exercise;
    mockCtx.prisma.exercise.delete.mockResolvedValue(exercise)
    await expect(workoutService.deleteExercise('',ctx)).rejects.toThrow("Parameter can not be left empty.")
})

test('Valid exercise returned should return success message', async () => {
    let exercise;
    mockCtx.prisma.exercise.delete.mockResolvedValue(exercise)
     expect(await workoutService.deleteExercise('valid',ctx)).toStrictEqual("Exercise Deleted.")
})