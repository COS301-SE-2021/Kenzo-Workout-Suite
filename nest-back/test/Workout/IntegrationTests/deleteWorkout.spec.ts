import {MockContext, Context, createMockContext, ActualPrisma} from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
import {v4 as uuidv4 } from 'uuid';
import {
    Workout,
    Exercise,
    User,
    Tag,
    Prisma, userType
} from '@prisma/client';
import {PrismaClient} from "@prisma/client/scripts/default-index";

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService
let prisma: PrismaClient
let userUUID=uuidv4();

beforeEach(async () => {
    workoutService = new WorkoutService(prisma);
    mockCtx = createMockContext();
    ctx = ActualPrisma();
    await ctx.prisma.exercise.deleteMany();
    await ctx.prisma.user.deleteMany();
    const myUser={
        userId:userUUID,
        email: "test@gmail.com",
        firstName: "test",
        lastName: "tester",
        password:"Test123*",
        userType: userType.PLANNER,
        dateOfBirth: null
    }

    await ctx.prisma.user.create({
        "data":myUser
    })


})

test('Should delete workout', async () => {

    let workoutUUID =uuidv4();
    const Workout = {
        workoutID: workoutUUID,
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner_ID: userUUID
    }
    const created = await ctx.prisma.workout.create({
        "data": Workout
    });
    await expect(workoutService.deleteWorkout(workoutUUID,ctx)).resolves.toEqual(
        "Workout Deleted."
    )
})

test('Should not delete workout [Parameters can not be left empty.]', async () => {

    let workoutUUID =uuidv4();
    const Workout = {
        workoutID: workoutUUID,
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner_ID: userUUID
    }

    const created = await ctx.prisma.workout.create({
        "data": Workout
    });
    await expect(workoutService.deleteWorkout("",ctx)).rejects.toThrow("Parameters can not be left empty.");
})

test('Should not delete workout [Workout with provided ID does not exist]', async () => {

    let workoutUUID =uuidv4();
    const Workout = {
        workoutID: workoutUUID,
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner_ID: userUUID
    }

    const created = await ctx.prisma.workout.create({
        "data": Workout
    });
    await expect(workoutService.deleteWorkout("fake",ctx)).rejects.toThrow("Workout with provided ID does not exist");
})


