import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
//import { Test, TestingModule } from '@nestjs/testing';
import {v4 as uuidv4 } from 'uuid';
import {
    Workout,
    Exercise,
    //User,
    Difficulty,
    Prisma
} from '@prisma/client';

let mockCtx: MockContext
let ctx: Context
let workoutService: WorkoutService

beforeEach(() => {
    workoutService = new WorkoutService;
    mockCtx = createMockContext()
    ctx = (mockCtx as unknown) as Context
})



test('should create new exercise ', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"TestExercise",
        description:"TestDescription",
        repRange:"TestRange",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        difficulty:Difficulty.EASY,
        duratime:2,
        workoutWorkoutID: null
    }
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).resolves.toEqual(
        "Exercise created."
    )
})

test('Should not create workout [Throws Empty Parameters error(Title)]  ', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"",
        description:"TestDescription",
        repRange:"TestRange",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        difficulty:Difficulty.EASY,
        duratime:2,
        workoutWorkoutID: null
    }
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not create workout [Throws Empty Parameters error(Description)]  ', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"TestTitle",
        description:"",
        repRange:"TestRange",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        difficulty:Difficulty.EASY,
        duratime:2,
        workoutWorkoutID: null
    }
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not create workout [Throws Empty Parameters error(Rep range)]  ', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"",
        description:"TestDescription",
        repRange:"",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        difficulty:Difficulty.EASY,
        duratime:2,
        workoutWorkoutID: null
    }
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not create workout [Throws Empty Parameters error(Sets)]  ', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"",
        description:"TestDescription",
        repRange:"",
        sets:0,
        Posedescription:"TestPDesc",
        restPeriod:2,
        difficulty:Difficulty.EASY,
        duratime:2,
        workoutWorkoutID: null
    }
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not create workout [Throws Empty Parameters error(Pose Description)]  ', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"",
        description:"TestDescription",
        repRange:"",
        sets:4,
        Posedescription:"",
        restPeriod:2,
        difficulty:Difficulty.EASY,
        duratime:2,
        workoutWorkoutID: null
    }
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not create workout [Throws Empty Parameters error(Rest Period)]  ', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"",
        description:"TestDescription",
        repRange:"",
        sets:4,
        Posedescription:"",
        restPeriod:0,
        difficulty:Difficulty.EASY,
        duratime:2,
        workoutWorkoutID: null
    }
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not create workout [Throws Empty Parameters error(Duration)]  ', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"",
        description:"TestDescription",
        repRange:"",
        sets:4,
        Posedescription:"",
        restPeriod:2,
        difficulty:Difficulty.EASY,
        duratime:0,
        workoutWorkoutID: null
    }
    mockCtx.prisma.exercise.create.mockResolvedValue(Exercise)

    await expect(workoutService.createExercise(Exercise.title,Exercise.description,Exercise.repRange,Exercise.sets,Exercise.Posedescription,Exercise.restPeriod,Exercise.difficulty,Exercise.duratime,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})