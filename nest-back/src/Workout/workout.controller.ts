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
    Difficulty,
    PrismaClient,
    Prisma
} from '@prisma/client';
import {ActualPrisma, Context} from "../../context";
import {
    ApiBody,
    ApiCreatedResponse, ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse, ApiParam, ApiProperty, ApiQuery,
    ApiResponse
} from "@nestjs/swagger";
import {CreateExerciseDTO, CreateWorkoutDTO, DeleteWorkoutDTO, UpdateWorkoutDTO} from "./workout.model";
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
    //TODO:Remind Tin about GetExerciseByID
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
        description: 'A workout object.'
    })
    @ApiNotFoundResponse({
        description: 'No workouts were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
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
    //TODO:Use req and auth for userID [consult Zelu]
    @UseGuards(JwtAuthGuard)
    @Post('createWorkout')
    @ApiBody({type: CreateWorkoutDTO})
    @ApiOkResponse({
        description: 'A workout object.'
    })
    @ApiNotFoundResponse({
        description: 'No workouts were found in the database.'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    async createWorkout(
        @Body('workoutTitle') workoutTitle: string,
        @Body('workoutDescription') workoutDescription: string,
        @Body('exercises') exercises : Exercise[],
        @Body('difficulty') difficulty: Difficulty,
        @Request() req
    ) {

        return this.workoutService.createWorkout(workoutTitle,workoutDescription,exercises,difficulty,req.user.userId , this.ctx)

    }

    @UseGuards(JwtAuthGuard)
    @Put ("updateWorkout")
    @ApiBody({type: UpdateWorkoutDTO})
    @ApiOkResponse({
        description: 'Workout Updated'
    })
    @ApiNotFoundResponse({
        description: 'Workout with provided ID does not exist'
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error.'
    })
    async updateWorkout(
        @Body('workoutID') workoutID: string,
        @Body('workoutTitle') workoutTitle: string,
        @Body('workoutDescription') workoutDescription: string,
        @Body('exercises') exercises : Exercise[],
        @Body('difficulty') difficulty: Difficulty,
        @Request() req
    ){
        return this.workoutService.updateWorkout(workoutID,workoutTitle,workoutDescription,exercises,difficulty,req.user.userId,this.ctx);
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


}
