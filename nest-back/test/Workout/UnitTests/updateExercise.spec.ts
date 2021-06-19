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

test('Null exercise passed in, should throw PreconditionFailedException', async () => {
    let exercise;
    mockCtx.prisma.tag.update.mockResolvedValue(exercise)
    await expect(workoutService.updateExercise('','','','',0,'',0,[],0,ctx)).rejects.toThrow("Invalid exercise object passed in.")
})

test('Incomplete exercise passed in, should throw PreconditionFailedException', async () => {
    let exercise;
    mockCtx.prisma.tag.update.mockResolvedValue(exercise)
    await expect(workoutService.updateExercise('test','','test','',0,'test',0,[],0,ctx)).rejects.toThrow("Invalid exercise object passed in.")
})

test('Nonexistent exercise, should throw NotFoundException', async () => {
    let exercise;
    mockCtx.prisma.tag.update.mockResolvedValue(exercise)
    await expect(workoutService.updateExercise('test','test','test','test',0,'test',0,[],0,ctx)).rejects.toThrow("Exercise with provided ID does not exist.")
})


