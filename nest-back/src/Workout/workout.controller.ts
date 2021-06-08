import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
} from '@nestjs/common';
import {WorkoutService} from "./workout.service";
import {
    Workout,
    Exercise,
    Planner,
    Difficulty,
    PrismaClient,
    Prisma
} from '@prisma/client';
import {ActualPrisma, Context} from "../../context";



@Controller('workout')
export class WorkoutController {

    constructor(private readonly workoutService: WorkoutService) {

    }

    @Get('getWorkoutByTitle/:title')
    getWorkoutByTitle(
        @Param('title') title: string,
    ) {
        return this.workoutService.getWorkoutByTitle(title);
    }

    @Get('getExerciseByTitle/:title')
    getExerciseByTitle(
        @Param('title') title: string,
    ) {
        return this.workoutService.getExerciseByTitle(title);
    }

    @Get('getWorkoutByPlanner/:email')
    getWorkoutByPlanner(
        @Param('email') email: string,
    ) {
        return this.workoutService.getWorkoutByPlanner(email);
    }

    @Post('createExercise')
    createExercise(
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('repRange') repRange: string,
        @Body('sets') sets: number,
        @Body('Posedescription') Posedescription: string,
        @Body('restPeriod') restPeriod: number,
        @Body('difficulty') difficulty: Difficulty,
        @Body('duratime') duration: number,
    ) {
        return this.createExercise(title,description,repRange,sets,Posedescription,restPeriod,difficulty,duration);
    }

    @Post('createWorkout')
    createWorkout(
        @Body('workoutTitle') workoutTitle: string,
        @Body('workoutDescription') workoutDescription: string,
        @Body('difficulty') difficulty: Difficulty,
        ctx: Context
    ) {
        ctx = ActualPrisma();
        return this.workoutService.createWorkout(workoutTitle,workoutDescription,difficulty, ctx)

    }


}
