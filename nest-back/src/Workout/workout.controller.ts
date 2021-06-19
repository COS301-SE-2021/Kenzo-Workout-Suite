import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete, UseGuards, Request,
} from '@nestjs/common';
import {WorkoutService} from "./workout.service";
import {
    Workout,
    Exercise,
    User,
    Tag,
    PrismaClient,
    Prisma
} from '@prisma/client';
import {ActualPrisma, Context} from "../../context";
import {
    ApiBadRequestResponse,
    ApiBody, ApiConflictResponse,
    ApiInternalServerErrorResponse, ApiNotAcceptableResponse,
    ApiNotFoundResponse,
    ApiOkResponse, ApiPreconditionFailedResponse
} from "@nestjs/swagger";

import {
    CreateExerciseDTO,
    CreateWorkoutDTO,
    DeleteWorkoutDTO,
    UpdateWorkoutDTO,
    createTagDTO,
    deleteExerciseDTO, updateExerciseDTO
} from "./workout.model";
import {JwtAuthGuard} from "../user/jwt-auth.guard";

@Controller('workout')
export class WorkoutController {

    ctx: Context

    constructor(private readonly workoutService: WorkoutService) {
        this.ctx = ActualPrisma();
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

    @Get('getWorkoutById/:id')
    @ApiOkResponse({
        description: 'A workout object.'
    })
    @ApiNotFoundResponse({
        description: 'No workouts were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    getWorkoutById(
        @Param('id') id: string,
    ) {
        return this.workoutService.getWorkoutById(id,ActualPrisma());
    }
    @Get('getExercises')
    @ApiOkResponse({
        description: 'An exercise object.'
    })
    @ApiNotFoundResponse({
        description: 'No exercises were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    getExercises(
    ) {
        return this.workoutService.getExercises(ActualPrisma());
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
    @Get('getExerciseByID/:ID')
    @ApiOkResponse({
        description: 'A workout object.'
    })
    @ApiNotFoundResponse({
        description: 'No workouts were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    getExerciseByID(
        @Param('id') id: string,
    ) {
        return this.workoutService.getExerciseByID(id,ActualPrisma());
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
    @ApiOkResponse({
        description: 'Exercise Created'
    })
    @ApiBadRequestResponse({
        description: 'Could not create exercise.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    @ApiBody({type: CreateExerciseDTO})
    createExercise(
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('repRange') repRange: string,
        @Body('sets') sets: number,
        @Body('Posedescription') Posedescription: string,
        @Body('restPeriod') restPeriod: number,
        @Body('tags') tags: Tag[],
        @Body('duratime') duration: number,
    ) {
        return this.workoutService.createExercise(title,description,repRange,sets,Posedescription,restPeriod,tags,duration, this.ctx);
    }

    @Put('updateExercise')
    @ApiBody({type: updateExerciseDTO})
    @ApiOkResponse({
        description: 'Exercise updated.'
    })
    @ApiPreconditionFailedResponse({
        description: 'Invalid exercise object passed in.'
    })
    @ApiNotFoundResponse({
        description: 'Exercise with provided ID does not exist.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    updateExercise(
        @Body('exercise') exercise: string,
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('repRange') repRange: string,
        @Body('sets') sets: number,
        @Body('Posedescription') Posedescription: string,
        @Body('restPeriod') restPeriod: number,
        @Body('tags') tags: Tag[],
        @Body('duratime') duratime: number,
    ) {
        return this.workoutService.updateExercise(exercise,title,description,repRange,sets,Posedescription,restPeriod,tags,duratime,ActualPrisma());
    }

    @Delete("deleteExercise")
    @ApiBody({type: deleteExerciseDTO})
    @ApiOkResponse({
        description: 'Exercise Deleted.'
    })
    @ApiPreconditionFailedResponse({
        description: 'Parameter can not be left empty.'
    })
    @ApiNotFoundResponse({
        description: 'Exercise with provided ID does not exist'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    async deleteExercise(
        @Body('exercise') exercise: string,
    ){
        return this.workoutService.deleteExercise(exercise,ActualPrisma());
    }

    @UseGuards(JwtAuthGuard)
    @Post('createWorkout')
    @ApiBody({type: CreateWorkoutDTO})
    @ApiOkResponse({
        description: 'Workout Created'
    })
    @ApiBadRequestResponse({
        description: 'Could not create workout.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    async createWorkout(
        @Body('workoutTitle') workoutTitle: string,
        @Body('workoutDescription') workoutDescription: string,
        @Body('exercises') exercises : Exercise[],
        @Body('tags') tags: Tag[],
        @Request() req
    ) {

        return this.workoutService.createWorkout(workoutTitle,workoutDescription,exercises,tags,req.user.userId , this.ctx)

    }

    @UseGuards(JwtAuthGuard)
    @Put ("updateWorkout")
    @ApiBody({type: UpdateWorkoutDTO})
    @ApiOkResponse({
        description: 'Workout Updated'
    })
    @ApiBadRequestResponse({
        description: 'Could not update workout.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    async updateWorkout(
        @Body('workoutID') workoutID: string,
        @Body('workoutTitle') workoutTitle: string,
        @Body('workoutDescription') workoutDescription: string,
        @Body('exercises') exercises : Exercise[],
        @Body('tags') tags: Tag[],
        @Request() req
    ){
        return this.workoutService.updateWorkout(workoutID,workoutTitle,workoutDescription,exercises,tags,req.user.userId,this.ctx);
    }


    @Delete("deleteWorkout")
    @ApiBody({type: DeleteWorkoutDTO})
    @ApiOkResponse({
        description: 'Workout Deleted.'
    })
    @ApiNotFoundResponse({
        description: 'Workout with provided ID does not exist'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    async deleteWorkout(
        @Body('workoutID') workoutID: string,
    ){
        return this.workoutService.deleteWorkout(workoutID, this.ctx);
    }

    @Post('createTag')
    @ApiOkResponse({
        description: 'Successfully created Tag.'
    })
    @ApiNotAcceptableResponse({
        description: 'Profanity contained in label title.'
    })
    @ApiPreconditionFailedResponse({
        description: 'Parameter can not be left empty.'
    })
    @ApiConflictResponse({
        description: 'Label already exists in database.'
    })
    @ApiBadRequestResponse({
        description: 'Could not create tag.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
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
    @ApiNotFoundResponse({
        description: 'No tags were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    getTags(
    ) {
        return this.workoutService.getTags(ActualPrisma());
    }
}
