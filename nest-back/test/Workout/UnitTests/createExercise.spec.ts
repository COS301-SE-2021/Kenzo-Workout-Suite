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


describe('Unit tests for createExercise in workout subsystem', () => {
    test('Should create new Exercise without Tags', async () => {
        const Exercise = {
            exercise: uuidv4(),
            title: "TestExercise",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "TestPDesc",
            restPeriod: 2,
            duratime: 2,
            planner_ID: uuidv4()
        }
        mockCtx.prisma.exercise.create.mockResolvedValue(Exercise);
        let empty: Tag[] = [];

        await expect(workoutService.createExercise(Exercise.title, Exercise.description, Exercise.repRange, Exercise.sets, Exercise.Posedescription, Exercise.restPeriod, empty, Exercise.duratime, Exercise.planner_ID, ctx)).resolves.toEqual(
            "Exercise created."
        )
    })

    test('Should create new Exercise With Tags', async () => {
        const Exercise = {
            exercise: uuidv4(),
            title: "TestExercise",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "TestPDesc",
            restPeriod: 2,
            duratime: 2,
            planner_ID: uuidv4()
        }
        let tagArray: Tag[] = [{"label": "painful", "textColour": "blue", "backgroundColour": "white"}];
        spyOn(workoutService, "addNewTags");
        spyOn(workoutService, "createTag").and.returnValue(tagArray);
        mockCtx.prisma.exercise.create.mockResolvedValue(Exercise);


        await expect(workoutService.createExercise(Exercise.title, Exercise.description, Exercise.repRange, Exercise.sets, Exercise.Posedescription, Exercise.restPeriod, tagArray, Exercise.duratime, Exercise.planner_ID, ctx)).resolves.toEqual(
            "Exercise created."
        )
    })

    test('Should not create exercise, [Throws Empty Parameters error(Title)]  ', async () => {
        const Exercise = {
            exercise: uuidv4(),
            title: "",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "TestPDesc",
            restPeriod: 2,
            duratime: 2,
            planner_ID: uuidv4()
        }
        mockCtx.prisma.exercise.create.mockResolvedValue(Exercise);
        let empty: Tag[] = [];

        await expect(workoutService.createExercise(Exercise.title, Exercise.description, Exercise.repRange, Exercise.sets, Exercise.Posedescription, Exercise.restPeriod, empty, Exercise.duratime, Exercise.planner_ID, ctx)).rejects.toThrow(
            "Parameters can not be left empty."
        )
    })

    test('Should not create exercise, [Throws Empty Parameters error(Description)]  ', async () => {
        const Exercise = {
            exercise: uuidv4(),
            title: "TestTitle",
            description: "",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "TestPDesc",
            restPeriod: 2,
            duratime: 2,
            planner_ID: uuidv4()
        }
        mockCtx.prisma.exercise.create.mockResolvedValue(Exercise);
        let empty: Tag[] = [];

        await expect(workoutService.createExercise(Exercise.title, Exercise.description, Exercise.repRange, Exercise.sets, Exercise.Posedescription, Exercise.restPeriod, empty, Exercise.duratime, Exercise.planner_ID, ctx)).rejects.toThrow(
            "Parameters can not be left empty."
        )
    })

    test('Should not create exercise, [Throws Empty Parameters error(repRange)]  ', async () => {
        const Exercise = {
            exercise: uuidv4(),
            title: "TestTitle",
            description: "TestDescription",
            repRange: "",
            sets: 4,
            Posedescription: "TestPDesc",
            restPeriod: 2,
            duratime: 2,
            planner_ID: uuidv4()
        }
        mockCtx.prisma.exercise.create.mockResolvedValue(Exercise);
        let empty: Tag[] = [];

        await expect(workoutService.createExercise(Exercise.title, Exercise.description, Exercise.repRange, Exercise.sets, Exercise.Posedescription, Exercise.restPeriod, empty, Exercise.duratime, Exercise.planner_ID, ctx)).rejects.toThrow(
            "Parameters can not be left empty."
        )
    })

    test('Should not create exercise, [Throws Empty Parameters error(Sets)]  ', async () => {
        const Exercise = {
            exercise: uuidv4(),
            title: "TestTitle",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 0,
            Posedescription: "TestPDesc",
            restPeriod: 2,
            duratime: 2,
            planner_ID: uuidv4()
        }
        mockCtx.prisma.exercise.create.mockResolvedValue(Exercise);
        let empty: Tag[] = [];

        await expect(workoutService.createExercise(Exercise.title, Exercise.description, Exercise.repRange, Exercise.sets, Exercise.Posedescription, Exercise.restPeriod, empty, Exercise.duratime, Exercise.planner_ID, ctx)).rejects.toThrow(
            "Parameters can not be left empty."
        )
    })

    test('Should not create exercise, [Throws Empty Parameters error(Posedescription)]  ', async () => {
        const Exercise = {
            exercise: uuidv4(),
            title: "TestTitle",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "",
            restPeriod: 2,
            duratime: 2,
            planner_ID: uuidv4()
        }
        mockCtx.prisma.exercise.create.mockResolvedValue(Exercise);
        let empty: Tag[] = [];

        await expect(workoutService.createExercise(Exercise.title, Exercise.description, Exercise.repRange, Exercise.sets, Exercise.Posedescription, Exercise.restPeriod, empty, Exercise.duratime, Exercise.planner_ID, ctx)).rejects.toThrow(
            "Parameters can not be left empty."
        )
    })

    test('Should not create exercise, [Throws Empty Parameters error(restPeriod)]  ', async () => {
        const Exercise = {
            exercise: uuidv4(),
            title: "TestTitle",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "TestDescription",
            restPeriod: 0,
            duratime: 2,
            planner_ID: uuidv4()
        }
        mockCtx.prisma.exercise.create.mockResolvedValue(Exercise);
        let empty: Tag[] = [];

        await expect(workoutService.createExercise(Exercise.title, Exercise.description, Exercise.repRange, Exercise.sets, Exercise.Posedescription, Exercise.restPeriod, empty, Exercise.duratime, Exercise.planner_ID, ctx)).rejects.toThrow(
            "Parameters can not be left empty."
        )
    })

    test('Should not create exercise, [Throws Empty Parameters error(duratime/duration)]  ', async () => {
        const Exercise = {
            exercise: uuidv4(),
            title: "TestTitle",
            description: "TestDescription",
            repRange: "TestRange",
            sets: 4,
            Posedescription: "TestDescription",
            restPeriod: 2,
            duratime: 0,
            planner_ID: uuidv4()
        }
        mockCtx.prisma.exercise.create.mockResolvedValue(Exercise);
        let empty: Tag[] = [];

        await expect(workoutService.createExercise(Exercise.title, Exercise.description, Exercise.repRange, Exercise.sets, Exercise.Posedescription, Exercise.restPeriod, empty, Exercise.duratime, Exercise.planner_ID, ctx)).rejects.toThrow(
            "Parameters can not be left empty."
        )
    })
})