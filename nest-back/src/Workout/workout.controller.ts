import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {WorkoutService} from "./workoutService";

@Controller('workout')
export class WorkoutController {

    constructor(private readonly workoutService: WorkoutService) {
    }

    @Get('getWorkouts')
    getWorkouts(
    ) {
        return this.workoutService.getWorkouts();
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
    getUserByEmail(
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('repRange') repRange: string,
        @Body('sets') sets: number,
        @Body('poseDescription') poseDescription: string,
        @Body('restPeriod') restPeriod: number,
        @Body('difficulty') difficulty: string,
        @Body('duratime') duration: number,
    ) {
        return this.workoutService.createExercise(title,description,repRange,sets,poseDescription,restPeriod,difficulty,duration);
    }

    @Post('createWorkout')
    createWorkout(
        @Body('workoutTitle') workoutTitle: string,
        @Body('workoutDescription') workoutDescription: string,
        @Body('difficulty') difficulty: string,
    ) {
        return this.workoutService.createWorkout(workoutTitle,workoutDescription,difficulty);
    }

}
