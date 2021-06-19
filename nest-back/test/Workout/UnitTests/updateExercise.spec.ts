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

test('Valid exercise passed in with tags, should receive successful message', async () => {
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
    mockCtx.prisma.exercise.update.mockResolvedValue(Exercise)

    const response=await workoutService.updateExercise(uuidExercise,'test','test','test',4,'test',2,[{label:'test',textColour:'test',backgroundColour:'test'}],2,ctx)
    console.log(response);
    expect(response).toBe("Exercise updated.");
})

test('Valid exercise passed in without tags, should receive successful message', async () => {
    const Exercise = {
        exercise:uuidExercise,
        title:"test",
        description:"test",
        repRange:"test",
        sets:4,
        Posedescription:"test",
        restPeriod:2,
        tags: [],
        duratime:2,
        workouts: null
    }
    mockCtx.prisma.exercise.update.mockResolvedValue(Exercise)

    const response=await workoutService.updateExercise(uuidExercise,'test','test','test',4,'test',2,[{label:'test',textColour:'test',backgroundColour:'test'}],2,ctx)

    expect(response).toBe("Exercise updated.");
})

test('Null exercise passed in, should throw PreconditionFailedException', async () => {
    let tag;
    mockCtx.prisma.tag.create.mockResolvedValue(tag)
    await expect(workoutService.updateExercise('','','','',0,'',0,[],0,ctx)).rejects.toThrow("Invalid exercise object passed in.")
})

test('Incomplete exercise passed in, should throw PreconditionFailedException', async () => {
    let tag;
    mockCtx.prisma.tag.create.mockResolvedValue(tag)
    await expect(workoutService.updateExercise('test','','test','',0,'test',0,[],0,ctx)).rejects.toThrow("Invalid exercise object passed in.")
})

test('Nonexistent exercise, should throw NotFoundException', async () => {
    let tag;
    mockCtx.prisma.tag.create.mockResolvedValue(tag)
    await expect(workoutService.updateExercise('test','test','test','test',0,'test',0,[],0,ctx)).rejects.toThrow("Exercise with provided ID does not exist.")
})


