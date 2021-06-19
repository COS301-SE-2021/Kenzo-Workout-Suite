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

test('Should update new workout [Without Tags or Exercises]', async () => {
    let workout;
    let emptyTag: Tag[] = [];
    let emptyExercise: Exercise[] = [];
    mockCtx.prisma.tag.update.mockResolvedValue(workout);
    spyOn(workoutService,"generateWorkoutPDF").and.stub();
    await expect(workoutService.updateWorkout(uuidv4(),'Test','test',emptyExercise,emptyTag,uuidv4(),ctx)).resolves.toEqual(
        "Workout Updated."
    )
})

test('Should create new workout [Without Exercises]', async () => {
    let Workout ;
    let tagArray: Tag[] = [{"label":"painful","textColour":"blue","backgroundColour":"white"}];
    spyOn(workoutService,"addNewTags");
    spyOn(workoutService,"createTag").and.returnValue(tagArray);
    let emptyExercise: Exercise[] = [];
    spyOn(workoutService,"generateWorkoutPDF").and.stub();
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);


    await expect(workoutService.updateWorkout(uuidv4(),'Test','test',emptyExercise,tagArray,uuidv4(),ctx)).resolves.toEqual(
        "Workout Updated."
    )
})

test('Should create new workout [Without Tags]', async () => {
    let Workout ;
    let Exercise ;
    let emptyTag: Tag[] = [];
    let fullExercise: Exercise[] = [Exercise];
    spyOn(workoutService,"generateWorkoutPDF").and.stub();
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);


    await expect(workoutService.updateWorkout(uuidv4(),'Test','test',fullExercise,emptyTag,uuidv4(),ctx)).resolves.toEqual(
        "Workout Updated."
    )
})

test('Should create new workout [With tags and exercises]', async () => {
    let Exercise ;
    let Workout ;
    let tagArray: Tag[] = [{"label":"painful","textColour":"blue","backgroundColour":"white"}];
    spyOn(workoutService,"addNewTags");
    spyOn(workoutService,"createTag").and.returnValue(tagArray);
    let fullExercise: Exercise[] = [Exercise];
    spyOn(workoutService,"generateWorkoutPDF").and.stub();
    mockCtx.prisma.workout.create.mockResolvedValue(Workout);

    await expect(workoutService.updateWorkout(uuidv4(),'Test','test',fullExercise,tagArray,uuidv4(),ctx)).resolves.toEqual(
        "Workout Updated."
    )
})

test('Should not update workout, [Throws Empty Parameters error(workoutTitle)]  ', async () => {
    let workout;
    let emptyTag: Tag[] = [];
    let emptyExercise: Exercise[] = [];
    mockCtx.prisma.tag.update.mockResolvedValue(workout);
    spyOn(workoutService,"generateWorkoutPDF").and.stub();
    await expect(workoutService.updateWorkout(uuidv4(),'','test',emptyExercise,emptyTag,uuidv4(),ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

test('Should not update workout, [Throws Empty Parameters error(workoutTitle)]  ', async () => {
    let workout;
    let emptyTag: Tag[] = [];
    let emptyExercise: Exercise[] = [];
    mockCtx.prisma.tag.update.mockResolvedValue(workout);
    spyOn(workoutService,"generateWorkoutPDF").and.stub();
    await expect(workoutService.updateWorkout(uuidv4(),'test','',emptyExercise,emptyTag,uuidv4(),ctx)).rejects.toThrow(
        "Parameters can not be left empty."
    )
})

