import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {WorkoutService} from "./workout.service";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse, ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse, ApiParam, ApiProperty, ApiQuery,
    ApiResponse
} from "@nestjs/swagger";
import {ActualPrisma} from "../../context";
import { CreateExerciseDTO, createTagDTO } from "./workout.model";

@Controller('workout')
export class WorkoutController {

    constructor(private readonly workoutService: WorkoutService) {
    }

    @Get('getWorkouts')
    @ApiOkResponse({
        description: 'A workout object.'
    })
    @ApiNotFoundResponse({
        description: 'No workouts were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    getWorkouts(
    ) {
        return this.workoutService.getWorkouts(ActualPrisma());
    }

    @Get('getWorkoutByTitle/:title')
    @ApiOkResponse({
        description: 'A workout object.'
    })
    @ApiNotFoundResponse({
        description: 'No workouts were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    getWorkoutByTitle(
        @Param('title') title: string,
    ) {
        return this.workoutService.getWorkoutByTitle(title,ActualPrisma());
    }

    @Get('getExerciseByTitle/:title')
    @ApiOkResponse({
        description: 'A workout object.'
    })
    @ApiNotFoundResponse({
        description: 'No workouts were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    getExerciseByTitle(
        @Param('title') title: string,
    ) {
        return this.workoutService.getExerciseByTitle(title,ActualPrisma());
    }

    @Get('getWorkoutByPlanner/:id')
    @ApiOkResponse({
        description: 'A workout object.'
    })
    @ApiNotFoundResponse({
        description: 'No workouts were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    getWorkoutByPlanner(
        @Param('id') id: string,
    ) {
        return this.workoutService.getWorkoutByPlanner(id,ActualPrisma());
    }

    @Post('createExercise')
    @ApiBody({type: CreateExerciseDTO})
    @ApiOkResponse({
        description: 'A workout object.'
    })
    @ApiNotFoundResponse({
        description: 'No workouts were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
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

    @Post('createTag')
    @ApiBody({type: createTagDTO})
    createTag(
        @Body('label') label: string,
        @Body('textColour') textColour: string,
        @Body('backgroundColour') backgroundColour: string,
    ) {
        return this.workoutService.createTag(label,textColour,backgroundColour,ActualPrisma());
    }


    @Get('getTags')
    @ApiOkResponse({
        description: 'Successfully created Tag.'
    })
    @ApiBadRequestResponse({
        description: 'Could not create tag.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    getTags(
    ) {
        return this.workoutService.getTags(ActualPrisma());
    }

}
