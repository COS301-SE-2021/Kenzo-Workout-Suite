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

test('Should receive valid information about all tags', async () => {
    const tag = [{
        label: 'test',
        textColour: 'test',
        backgroundColour: 'test'
    }]
    mockCtx.prisma.tag.findMany.mockResolvedValue(tag)

    const response=await workoutService.getTags(ctx)

    expect(response).toBe(tag);
})