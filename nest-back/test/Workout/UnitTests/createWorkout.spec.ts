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


test('Should create new workout [Without Tags or Exercises]', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner_ID: uuidv4()
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);
    let emptyTag: Tag[] = [];
    let emptyExercise: Exercise[] = [];
    spyOn(workoutService,"generateWorkoutPDF").and.stub();

    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription,emptyExercise ,emptyTag, Workout.planner_ID,ctx)).resolves.toEqual(
        "Workout Created."
    )
})

test('Should create new workout [Without Exercises]', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner_ID: uuidv4()
    }
    let tagArray: Tag[] = [{"label":"painful","textColour":"blue","backgroundColour":"white"}];
    spyOn(workoutService,"addNewTags");
    spyOn(workoutService,"createTag").and.returnValue(tagArray);
    let emptyExercise: Exercise[] = [];
    spyOn(workoutService,"generateWorkoutPDF").and.stub();
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);


    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription,emptyExercise ,tagArray, Workout.planner_ID,ctx)).resolves.toEqual(
        "Workout Created."
    )
})

test('Should create new workout [Without Tags]', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner_ID: uuidv4()
    }
    const Exercise = {
        exercise:uuidv4(),
        title:"TestExercise",
        description:"TestDescription",
        repRange:"TestRange",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        duratime:2,
        planner_ID:uuidv4()
    }
    let emptyTag: Tag[] = [];
    let fullExercise: Exercise[] = [Exercise];
    spyOn(workoutService,"generateWorkoutPDF").and.stub();
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);


    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription,fullExercise ,emptyTag, Workout.planner_ID,ctx)).resolves.toEqual(
        "Workout Created."
    )
})

test('Should create new workout [With tags and exercises]', async () => {
    const Exercise = {
        exercise:uuidv4(),
        title:"TestExercise",
        description:"TestDescription",
        repRange:"TestRange",
        sets:4,
        Posedescription:"TestPDesc",
        restPeriod:2,
        duratime:2,
        planner_ID:uuidv4()
    }
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "Test",
        workoutDescription: "Test",
        planner_ID: uuidv4()
    }
    let tagArray: Tag[] = [{"label":"painful","textColour":"blue","backgroundColour":"white"}];
    spyOn(workoutService,"addNewTags");
    spyOn(workoutService,"createTag").and.returnValue(tagArray);
    let fullExercise: Exercise[] = [Exercise];
    spyOn(workoutService,"generateWorkoutPDF").and.stub();
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);

    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription,fullExercise ,tagArray, Workout.planner_ID,ctx)).resolves.toEqual(
        "Workout Created."
    )
})

test('Should not create workout, [Throws Empty Parameters error(workoutTitle)]  ', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "",
        workoutDescription: "Test",
        planner_ID: uuidv4()
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);
    let emptyTag: Tag[] = [];
    let emptyExercise: Exercise[] = [];
    spyOn(workoutService,"generateWorkoutPDF").and.stub();

    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription,emptyExercise ,emptyTag, Workout.planner_ID,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not create workout, [Throws Empty Parameters error(workoutDescription)]  ', async () => {
    const Workout = {
        workoutID: uuidv4(),
        workoutTitle: "Test",
        workoutDescription: "",
        planner_ID: uuidv4()
    }
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);
    let emptyTag: Tag[] = [];
    let emptyExercise: Exercise[] = [];
    spyOn(workoutService,"generateWorkoutPDF").and.stub();

    await expect(workoutService.createWorkout(Workout.workoutTitle,Workout.workoutDescription,emptyExercise ,emptyTag, Workout.planner_ID,ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})



