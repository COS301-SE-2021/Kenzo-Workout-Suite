import { MockContext, Context, createMockContext } from "../../../context";
import {WorkoutService} from "../../../src/Workout/workout.service";
//import { Test, TestingModule } from '@nestjs/testing';
import {v4 as uuidv4 } from 'uuid';
import {
    Workout,
    Exercise,
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

test('Should recieve valid information about workout with corresponding title', async () => {
    //mockCtx.prisma.workout.findMany.mockResolvedValue()
})

test('Should not recieve valid information about workout with corresponding title as workout does not exist', async () => {
    //mockCtx.prisma.workout.findMany.mockResolvedValue()
})