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

test('Should resolve addition of tags.', async () => {
    let tagArray: Tag[] = [{"label":"painful","textColour":"blue","backgroundColour":"white"}];
    mockCtx.prisma.tag.count.mockResolvedValue(0);
    spyOn(workoutService,"createTag").and.returnValue(tagArray);
    await expect(workoutService.addNewTags(tagArray,ctx)).resolves;
})

test('Should not resolve the addition of tags.', async () => {
    let tagArray: Tag[] = [];
    mockCtx.prisma.tag.count.mockResolvedValue(0);
    spyOn(workoutService,"createTag").and.returnValue(tagArray);
    await expect(workoutService.addNewTags(tagArray,ctx)).rejects.toThrow("Cannot work with empty tags.");
})