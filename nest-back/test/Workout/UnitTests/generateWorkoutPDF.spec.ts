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


test('Should not Generate WorkoutPDF [Precondition Exception]', async () => {
    let Workout = {
        workoutID: uuidv4(),
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner_ID: uuidv4()
    }
    await expect(workoutService.generateWorkoutPDF(Workout,ctx)).resolves;
})
test('Should not Generate WorkoutPDF [Precondition Exception]', async () => {
    let workout;
    await expect(workoutService.generateWorkoutPDF(workout,ctx)).rejects.toThrow("Invalid workout provided");
})