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
let exerciseUUID=uuidv4();

const Exercise = {
    exercise:exerciseUUID,
    title:"TestExercise",
    description:"TestDescription",
    repRange:"TestRange",
    sets:4,
    Posedescription:"TestPDesc",
    restPeriod:2,
    duratime:2,
    planner_ID:userUUID
}


beforeEach(async () => {
    workoutService = new WorkoutService(prisma);
    mockCtx = createMockContext();
    ctx = ActualPrisma();
    await ctx.prisma.exercise.deleteMany();
    await ctx.prisma.user.deleteMany();
    await ctx.prisma.tag.deleteMany();
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

    await ctx.prisma.exercise.create({
        "data":Exercise
    })
})

test('Should update workout [no tags or exercises]', async () => {

    let workoutUUID =uuidv4();
    const Workout = {
        workoutID: workoutUUID,
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner: {
            connect: {
                userId: userUUID
            }
        }
    }
    await ctx.prisma.workout.create({
        data: Workout
    })
    let emptyTag: Tag[] = [];
    let emptyExercise: Exercise[] = [];

    await expect(workoutService.updateWorkout(workoutUUID,"WorkoutUpdateTest",Workout.workoutDescription,emptyExercise,emptyTag,userUUID,ctx)).resolves.toEqual(
        "Workout Updated."
    )
})

test('Should update new workout [With tags and exercises]', async () => {


    let tagArray: Tag[] = [{"label":"painful","textColour":"blue","backgroundColour":"white"}];

    let workoutUUID =uuidv4();
    const Workout = {
        workoutID: workoutUUID,
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner: {
            connect: {
                userId: userUUID
            }
        }
    }
    await ctx.prisma.workout.create({
        data: Workout
    })
    let fullExercise = [Exercise];

    await expect(workoutService.updateWorkout(workoutUUID,"WorkoutUpdateTest",Workout.workoutDescription, fullExercise ,tagArray, userUUID,ctx)).resolves.toEqual(
        "Workout Updated."
    )
})

test('Should update new workout [With tags only]', async () => {

    let workoutUUID =uuidv4();
    const Workout = {
        workoutID: workoutUUID,
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner: {
            connect: {
                userId: userUUID
            }
        }
    }
    await ctx.prisma.workout.create({
        data: Workout
    })
    let tagArray: Tag[] = [{"label":"painful","textColour":"blue","backgroundColour":"white"}];
    let emptyExercise: Exercise[] = [];

    await expect(workoutService.updateWorkout(workoutUUID,"WorkoutUpdateTest",Workout.workoutDescription, emptyExercise ,tagArray, userUUID,ctx)).resolves.toEqual(
        "Workout Updated."
    )
})

test('Should update new workout [With exercises only]', async () => {

    let workoutUUID =uuidv4();
    const Workout = {
        workoutID: workoutUUID,
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner: {
            connect: {
                userId: userUUID
            }
        }
    }
    await ctx.prisma.workout.create({
        data: Workout
    })
    let emptyTags: Tag[] = [];
    let fullExercise = [Exercise];

    await expect(workoutService.updateWorkout(workoutUUID,"WorkoutUpdateTest",Workout.workoutDescription, fullExercise ,emptyTags, userUUID,ctx)).resolves.toEqual(
        "Workout Updated."
    )
})

test('Should not update workout [Missing Title - Throws Parameters can not be left empty.]', async () => {

    let workoutUUID =uuidv4();
    const Workout = {
        workoutID: workoutUUID,
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner: {
            connect: {
                userId: userUUID
            }
        }
    }
    await ctx.prisma.workout.create({
        data: Workout
    })
    let emptyTag: Tag[] = [];
    let emptyExercise: Exercise[] = [];

    await expect(workoutService.updateWorkout(workoutUUID,"",Workout.workoutDescription,emptyExercise,emptyTag,userUUID,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not update workout [Missing Description - Throws Parameters can not be left empty.]', async () => {

    let workoutUUID =uuidv4();
    const Workout = {
        workoutID: workoutUUID,
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner: {
            connect: {
                userId: userUUID
            }
        }
    }
    await ctx.prisma.workout.create({
        data: Workout
    })
    let emptyTag: Tag[] = [];
    let emptyExercise: Exercise[] = [];

    await expect(workoutService.updateWorkout(workoutUUID,"WorkoutUpdateTest","",emptyExercise,emptyTag,userUUID,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})
