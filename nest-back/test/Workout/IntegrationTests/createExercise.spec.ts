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

beforeEach(async () => {
    workoutService = new WorkoutService(prisma);
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

test("Should create exercise", async () => {
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
    let emptyTag: Tag[] = [];

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange ,Exercise.sets, Exercise.Posedescription,Exercise.restPeriod,emptyTag,Exercise.duratime,userUUID,ctx)).resolves.toEqual(
        "Exercise created."
    )
})

test("Should not create exercise [Throws Parameters can not be left empty.]", async () => {
    const Exercise = {
        exercise:exerciseUUID,
        title:"",
        description:"TestDescription",
        repRange:"TestRange",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        duratime:2,
        planner_ID:userUUID
    }
    let emptyTag: Tag[] = [];

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange ,Exercise.sets, Exercise.Posedescription,Exercise.restPeriod,emptyTag,Exercise.duratime,userUUID,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})