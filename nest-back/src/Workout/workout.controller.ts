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
    User,
    Difficulty,
    PrismaClient,
    Prisma
} from '@prisma/client';
import {ActualPrisma, Context} from "../../context";



@Controller('workout')
export class WorkoutController {

    ctx: Context

    constructor(private readonly workoutService: WorkoutService) {
        this.ctx = ActualPrisma();
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
        return this.workoutService.createExercise(title,description,repRange,sets,Posedescription,restPeriod,difficulty,duration, this.ctx);
    }

    @Post('createWorkout')
    createWorkout(
        @Body('workoutTitle') workoutTitle: string,
        @Body('workoutDescription') workoutDescription: string,
        @Body('exercises') exercises : Exercise[],
        @Body('difficulty') difficulty: Difficulty,
        @Body('planner_ID') planner_ID : string
    ) {

        return this.workoutService.createWorkout(workoutTitle,workoutDescription,exercises,difficulty,planner_ID, this.ctx)

    }


}
