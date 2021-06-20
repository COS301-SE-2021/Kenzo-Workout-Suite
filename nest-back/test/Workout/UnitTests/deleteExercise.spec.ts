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

test('Valid exercise passed in, should receive successful message', async () => {
    const Exercise = {
        exercise:uuidExercise,
        title:"test",
        description:"test",
        repRange:"test",
        sets:4,
        Posedescription:"test",
        restPeriod:2,
        tags: [{
            label:'test',
            textColour:'test',
            backgroundColour:'test'
        }],
        duratime:2,
        workouts: null
    }
    mockCtx.prisma.exercise.delete.mockResolvedValue(Exercise)

    const response=await workoutService.deleteExercise(uuidExercise,ctx)
    expect(response).toBe("Exercise Deleted.");
})

test('Null exercise ID passed in, should throw PreconditionFailedException', async () => {
    let exercise;
    mockCtx.prisma.exercise.delete.mockResolvedValue(exercise)
    await expect(workoutService.deleteExercise('',ctx)).rejects.toThrow("Parameter can not be left empty.")
})

test('Invalid exercise ID passed in, should throw NotFoundException', async () => {
    let exercise;
    mockCtx.prisma.exercise.delete.mockResolvedValue(exercise)
    await expect(workoutService.deleteExercise('invalid',ctx)).rejects.toThrow("Exercise with provided ID does not exist")
})