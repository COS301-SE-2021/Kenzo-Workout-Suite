import {MockContext, Context, createMockContext, ActualPrisma} from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';
import {PrismaClient} from "@prisma/client/scripts/default-index";

let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

const uuidPlanner = uuidv4();

beforeEach(async () => {
    workoutService = new WorkoutService(prisma);
    ctx = ActualPrisma()
    await ctx.prisma.tag.deleteMany();
})

test('Should receive valid information about all tags', async () => {
    await ctx.prisma.tag.create({
        data:{
            label: 'test',
            textColour: 'test',
            backgroundColour: 'test'
        }
    });

    const tag = [{
        label: 'test',
        textColour: 'test',
        backgroundColour: 'test'
    }]

    const response=await workoutService.getTags(ctx)

    expect(response).toStrictEqual(tag);
})

test('No tags created, should throw NotFoundException', async () => {
    await expect(workoutService.getTags(ctx)).rejects.toThrow("No tags were found in the database.")
})