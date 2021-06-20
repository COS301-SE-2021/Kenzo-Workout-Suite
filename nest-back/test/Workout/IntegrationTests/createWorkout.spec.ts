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

describe('Integration test for createWorkout for the user subsystem', () => {

    beforeEach(async () => {
        workoutService = new WorkoutService(prisma);
        mockCtx = createMockContext();
        ctx = ActualPrisma();
        await ctx.prisma.exercise.deleteMany();
        await ctx.prisma.user.deleteMany();
        await ctx.prisma.tag.deleteMany();
        const myUser = {
            userId: userUUID,
            email: "test@gmail.com",
            firstName: "test",
            lastName: "tester",
            password: "Test123*",
            userType: userType.PLANNER,
            dateOfBirth: null
        }

        await ctx.prisma.user.create({
            "data": myUser
        })

    })

    test('Should create workout [no tags or exercises]', async () => {

        let workoutUUID = uuidv4();
        const Workout = {
            workoutID: workoutUUID,
            workoutTitle: "Test",
            workoutDescription: "Test",
            planner_ID: userUUID
        }
        let emptyTag: Tag[] = [];
        let emptyExercise: Exercise[] = [];

        await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, emptyTag, Workout.planner_ID, ctx)).resolves.toEqual(
            "Workout Created."
        )
    })

    test('Should create new workout [With tags and exercises]', async () => {

        let workoutUUID = uuidv4();
        const Workout = {
            workoutID: workoutUUID,
            workoutTitle: "Test",
            workoutDescription: "Test",
            planner_ID: userUUID
        }
        let tagArray: Tag[] = [{"label": "painful", "textColour": "blue", "backgroundColour": "white"}];
        const Exercise = {
            exercise: exerciseUUID,
            title: "TestExercise",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "TestPDesc",
            restPeriod: 2,
            duratime: 2,
            planner_ID: userUUID
        }
        await ctx.prisma.exercise.create({
            "data": Exercise
        })
        let emptyExercise: Exercise[] = [];
        let fullExercise = [Exercise];

        await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, fullExercise, tagArray, Workout.planner_ID, ctx)).resolves.toEqual(
            "Workout Created."
        )
    })

    test('Should create new workout [With tags only]', async () => {

        let workoutUUID = uuidv4();
        const Workout = {
            workoutID: workoutUUID,
            workoutTitle: "Test",
            workoutDescription: "Test",
            planner_ID: userUUID
        }
        let tagArray: Tag[] = [{"label": "painful", "textColour": "blue", "backgroundColour": "white"}];
        let emptyExercise: Exercise[] = [];

        await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, tagArray, Workout.planner_ID, ctx)).resolves.toEqual(
            "Workout Created."
        )
    })

    test('Should create new workout [With exercises only]', async () => {

        let workoutUUID = uuidv4();
        const Workout = {
            workoutID: workoutUUID,
            workoutTitle: "Test",
            workoutDescription: "Test",
            planner_ID: userUUID
        }
        let emptyTags: Tag[] = [];
        const Exercise = {
            exercise: exerciseUUID,
            title: "TestExercise",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "TestPDesc",
            restPeriod: 2,
            duratime: 2,
            planner_ID: userUUID
        }
        await ctx.prisma.exercise.create({
            "data": Exercise
        })
        let fullExercise = [Exercise];

        await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, fullExercise, emptyTags, Workout.planner_ID, ctx)).resolves.toEqual(
            "Workout Created."
        )
    })

    test('Should not create workout [Missing Title - Throws Parameters can not be left empty. ]', async () => {

        let workoutUUID = uuidv4();
        const Workout = {
            workoutID: workoutUUID,
            workoutTitle: "",
            workoutDescription: "Test",
            planner_ID: userUUID
        }
        let emptyTag: Tag[] = [];
        let emptyExercise: Exercise[] = [];

        await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, emptyTag, Workout.planner_ID, ctx)).rejects.toThrow(
            "Parameters can not be left empty."
        )
    })

    test('Should not create workout [Missing Description - Throws Parameters can not be left empty.]', async () => {

        let workoutUUID = uuidv4();
        const Workout = {
            workoutID: workoutUUID,
            workoutTitle: "Test",
            workoutDescription: "",
            planner_ID: userUUID
        }
        let emptyTag: Tag[] = [];
        let emptyExercise: Exercise[] = [];

        await expect(workoutService.createWorkout(Workout.workoutTitle, Workout.workoutDescription, emptyExercise, emptyTag, Workout.planner_ID, ctx)).rejects.toThrow(
            "Parameters can not be left empty."
        )
    })
})