import {MockContext, Context, createMockContext, ActualPrisma} from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';
import {PrismaClient} from "@prisma/client/scripts/default-index";

let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient

const uuidExercise = uuidv4();
const uuidPlanner = uuidv4();

beforeEach(async () => {
    workoutService = new WorkoutService(prisma);
    ctx = ActualPrisma()
    await ctx.prisma.exercise.deleteMany();
    await ctx.prisma.user.deleteMany();
    await ctx.prisma.user.create({
        data:{
            userId: uuidPlanner,
            email: "test&gmail.com",
            firstName: "test",
            lastName: "test",
            password: "Test123!",
            dateOfBirth: null,
            userType: "PLANNER",
        }
    });
})

test('Valid exercise passed in with tags, should receive successful message', async () => {
    await ctx.prisma.exercise.create({
        data:{
            exercise:uuidExercise,
            title:"test",
            description:"test",
            repRange:"test",
            sets:4,
            Posedescription:"test",
            restPeriod:2,
            duratime:2,
            planner_ID: uuidPlanner
        }
    });

    const response=await workoutService.updateExercise(uuidExercise,'test','test','test',4,'test',2,[{label:'test',textColour:'test',backgroundColour:'test'}],2,uuidPlanner,ctx)
    expect(response).toStrictEqual("Exercise updated.");
})

test('Valid exercise passed in without tags, should receive successful message', async () => {
    await ctx.prisma.exercise.create({
        data:{
            exercise:uuidExercise,
            title:"test",
            description:"test",
            repRange:"test",
            sets:4,
            Posedescription:"test",
            restPeriod:2,
            duratime:2,
            planner_ID: uuidPlanner
        }
    });

    const response=await workoutService.updateExercise(uuidExercise,'test','test','test',4,'test',2,[],2,uuidPlanner,ctx)
    expect(response).toStrictEqual("Exercise updated.");
})

test('Null exercise passed in, should throw PreconditionFailedException', async () => {
    await expect(workoutService.updateExercise('','','','',0,'',0,[],0,"",ctx)).rejects.toThrow("Invalid exercise object passed in.")
})

test('Incomplete exercise passed in, should throw PreconditionFailedException', async () => {
    await expect(workoutService.updateExercise('test','','test','',0,'test',0,[],0,"",ctx)).rejects.toThrow("Invalid exercise object passed in.")
})

test('Nonexistent exercise, should throw NotFoundException', async () => {
    await expect(workoutService.updateExercise('test','test','test','test',0,'test',0,[],0,"",ctx)).rejects.toThrow("Exercise with provided ID does not exist.")
})