import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {WorkoutService} from "./workout.service";
import {
    ApiBadRequestResponse,
    ApiBody, ApiConflictResponse,
    ApiInternalServerErrorResponse, ApiNotAcceptableResponse,
    ApiNotFoundResponse,
    ApiOkResponse
} from "@nestjs/swagger";
import {ActualPrisma} from "../../context";
import { createTagDTO } from "./workout.model";

@Controller('workout')
export class WorkoutController {

    constructor(private readonly workoutService: WorkoutService) {
    }

    @Post('createTag')
    @ApiOkResponse({
        description: 'Successfully created Tag.'
    })
    @ApiNotAcceptableResponse({
        description: 'Profanity contained in label title.'
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
