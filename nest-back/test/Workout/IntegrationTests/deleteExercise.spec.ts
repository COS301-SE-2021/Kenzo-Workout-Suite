import {MockContext, Context, createMockContext, ActualPrisma} from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';
import {PrismaClient} from "@prisma/client/scripts/default-index";

let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

const uuidExercise = uuidv4();

beforeEach(async () => {
    workoutService = new WorkoutService(prisma);
    ctx = ActualPrisma()
    await ctx.prisma.exercise.deleteMany();
    await ctx.prisma.exercise.create({
        data:{
            exercise:uuidExercise,
            title:"test",
            description:"test",
            repRange:"test",
            sets:4,
            Posedescription:"test",
            restPeriod:2,
            duratime:2
        }
    });
})

test('Null exercise ID passed in, should throw PreconditionFailedException', async () => {
    await expect(workoutService.deleteExercise('',ctx)).rejects.toThrow("Parameter can not be left empty.")
})

test('Invalid exercise ID passed in, should throw NotFoundException', async () => {
    await expect(workoutService.deleteExercise('invalid',ctx)).rejects.toThrow("")
})
