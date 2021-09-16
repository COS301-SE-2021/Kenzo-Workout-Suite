import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete, UseGuards, Request
} from "@nestjs/common"
import { WorkoutService } from "./workout.service"
import {
  Exercise,
  Tag
} from "@prisma/client"
import { ActualPrisma, Context } from "../../context"
import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiBody, ApiConflictResponse, ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse, ApiPreconditionFailedResponse, ApiServiceUnavailableResponse
} from "@nestjs/swagger"

import {
  CreateExerciseDTO,
  CreateWorkoutDTO,
  DeleteWorkoutDTO,
  UpdateWorkoutDTO,
  createTagDTO,
  deleteExerciseDTO, updateExerciseDTO, createVideoDTO, getWorkoutVideoDTO
} from "./workout.model"
import { JwtAuthGuard } from "../User/AuthGuards/jwt-auth.guard"

@Controller("workout")
export class WorkoutController {
    ctx: Context

    constructor (private readonly workoutService: WorkoutService) {
      this.ctx = ActualPrisma()
    }

    /**
     *Workout Controller - Get Workouts
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("getWorkouts")
    @ApiOkResponse({
      description: "A workout object."
    })
    @ApiNotFoundResponse({
      description: "No workouts were found in the database."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    getWorkouts (
    ) {
      return this.workoutService.getWorkouts(this.ctx)
    }

    /**
     *Workout Controller - Get Workouts by ID
     *
     * @param id This is the ID of the workout to be found in the database.
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified ID.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("getWorkoutById/:id")
    @ApiOkResponse({
      description: "A workout object."
    })
    @ApiNotFoundResponse({
      description: "No workouts were found in the database."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    getWorkoutById (
        @Param("id") id: string
    ) {
      return this.workoutService.getWorkoutById(id, this.ctx)
    }

    /**
     *Workout Controller - Get Exercises
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No exercises were found in the database.
     * @return  Promise array of exercise object/s.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("getExercises")
    @ApiOkResponse({
      description: "An exercise object."
    })
    @ApiNotFoundResponse({
      description: "No exercises were found in the database."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    getExercises (
    ) {
      return this.workoutService.getExercises(this.ctx)
    }

    /**
     *Workout Controller - Get Exercises by Title
     *
     * @param title This is the title of the exercise/s to be found in the database.
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No exercises were found in the database with the specified title.
     * @return  Promise array of exercises object/s.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("getExerciseByTitle/:title")
    @ApiOkResponse({
      description: "A workout object."
    })
    @ApiNotFoundResponse({
      description: "No workouts were found in the database."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    getExerciseByTitle (
        @Param("title") title: string
    ) {
      return this.workoutService.getExerciseByTitle(title, this.ctx)
    }

    /**
     *Workout Controller - Get Exercise by ID
     *
     * @param id This is the ID of the exercise to be found in the database.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified ID.
     * @return  Promise array of workout object/s.
     * @author Msi Sibanyoni
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("getExerciseByID/:ID")
    @ApiOkResponse({
      description: "A workout object."
    })
    @ApiNotFoundResponse({
      description: "No workouts were found in the database."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    getExerciseByID (
        @Param("id") id: string
    ) {
      return this.workoutService.getExerciseByID(id, this.ctx)
    }

    /**
     *Workout Controller - Get Workouts by Planner
     *
     * @param id This is the ID of the planner of the workout/s to be found in the database.
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified planner ID.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("getWorkoutByPlanner")
    @ApiOkResponse({
      description: "A workout object."
    })
    @ApiNotFoundResponse({
      description: "No workouts were found in the database."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    @ApiBearerAuth()
    getWorkoutByPlanner (
        @Request() req
    ) {
      return this.workoutService.getWorkoutByPlanner(req.user.userID, this.ctx)
    }

    @UseGuards(JwtAuthGuard)
    @Get("getExercisesByPlanner")
    @ApiOkResponse({
      description: "A exercise object."
    })
    @ApiNotFoundResponse({
      description: "No exercises were found in the database."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    @ApiBearerAuth()
    getExercisesPlanner (
        @Request() req
    ) {
      return this.workoutService.getExercisesByPlanner(req.user.userID, this.ctx)
    }

    /**
     *Workout Service - Create Exercise
     *
     * @param title This is the title of the exercise.
     * @param description This is the description of the exercise.
     * @param repRange This is the amount of reps.
     * @param sets This is the amount of sets.
     * @param Posedescription
     * @param restPeriod This is the rest period of the exercise.
     * @param tags this is an array of tags
     * @param duration
     * @param images
     * @param req
     * @throws PreconditionFailedException if:
     *                               -Not all parameters are given.
     * @throws NotFoundException if:
     *                               -An exercise with provided ID does not exist.
     * @return  Message indicating success.
     * @author Msi Sibanyoni
     *
     */
    @UseGuards(JwtAuthGuard)
    @Post("createExercise")
    @ApiOkResponse({
      description: "Exercise Created"
    })
    @ApiBadRequestResponse({
      description: "Could not create exercise."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    @ApiBody({ type: CreateExerciseDTO })
    @ApiBearerAuth()
    createExercise (
        @Body("exerciseTitle") title: string,
        @Body("exerciseDescription") description: string,
        @Body("repRange") repRange: string,
        @Body("sets") sets: number,
        @Body("poseDescription") Posedescription: string,
        @Body("restPeriod") restPeriod: number,
        @Body("tags") tags: Tag[],
        @Body("duration") duration: number,
        @Body("images") images: string[],
        @Request() req
    ) {
      return this.workoutService.createExercise(title, description, repRange, sets, Posedescription, restPeriod, tags, duration, req.user.userID, images, this.ctx)
    }

    /**
     *Workout Controller - Update Exercise
     *
     * @param exercise This is the ID of the exercise.
     * @param title This is the title of the exercise.
     * @param description This is the description of the exercise.
     * @param repRange This is the amount of reps.
     * @param sets This is the amount of sets.
     * @param poseDescription
     * @param restPeriod This is the rest period of the exercise.
     * @param tags these are the tags related to an exercise
     * @param duration this is the duration of an exercise
     * @param images
     * @param req This is the user request object
     * @throws PreconditionFailedException if:
     *                               -Not all parameters are given.
     * @throws NotFoundException if:
     *                               -An exercise with provided ID does not exist.
     * @return  Message indicating success.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Put("updateExercise")
    @ApiBody({ type: updateExerciseDTO })
    @ApiOkResponse({
      description: "Exercise updated."
    })
    @ApiPreconditionFailedResponse({
      description: "Invalid exercise object passed in."
    })
    @ApiNotFoundResponse({
      description: "Exercise with provided ID does not exist."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    @ApiBearerAuth()
    updateExercise (
        @Body("exerciseID") exercise: string,
        @Body("exerciseTitle") title: string,
        @Body("exerciseDescription") description: string,
        @Body("repRange") repRange: string,
        @Body("sets") sets: number,
        @Body("poseDescription") poseDescription: string,
        @Body("restPeriod") restPeriod: number,
        @Body("tags") tags: Tag[],
        @Body("duration") duration: number,
        @Body("images") images: string[],
        @Request() req
    ) {
      return this.workoutService.updateExercise(exercise, title, description, repRange, sets, poseDescription, restPeriod, tags, duration, req.user.userID, images, this.ctx)
    }

    /**
     *Workout Controller - Delete Exercise
     *
     * @param exercise This is the ID of the exercise.
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws PreconditionFailedException if:
     *                               -Parameter can not be left empty.
     * @throws NotFoundException if:
     *                               -An exercise with provided ID does not exist.
     * @return  Message indicating success.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Delete("deleteExercise")
    @ApiBody({ type: deleteExerciseDTO })
    @ApiOkResponse({
      description: "Exercise Deleted."
    })
    @ApiPreconditionFailedResponse({
      description: "Parameter can not be left empty."
    })
    @ApiNotFoundResponse({
      description: "Exercise with provided ID does not exist"
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    async deleteExercise (
        @Body("exerciseID") exercise: string
    ) {
      return this.workoutService.deleteExercise(exercise, this.ctx)
    }

    /**
     *Workout Service - Create Workout
     *
     * @param workoutTitle This is the string workout title
     * @param workoutDescription This is the string workout description
     * @param exercises This is an array of exercises
     * @param loop Duration each each exercise pose in seconds
     * @param songChoice Genre choice for background track
     * @param resolutionWidth The width of the resolution
     * @param resolutionHeight The height of the resolution
     * @param req This contains the User object of the User currently logged in [from this the string User id is retrieved]
     * @throws PreconditionFailedException if:
     *                               -Parameters can not be left empty.
     *
     * @return  Message indicating success.
     * @author Msi Sibanyoni
     *
     */
    @UseGuards(JwtAuthGuard)
    @Post("createWorkout")
    @ApiBody({ type: CreateWorkoutDTO })
    @ApiOkResponse({
      description: "Workout Created"
    })
    @ApiBadRequestResponse({
      description: "Could not create workout."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    @ApiBearerAuth()
    async createWorkout (
        @Body("workoutTitle") workoutTitle: string,
        @Body("workoutDescription") workoutDescription: string,
        @Body("exercises") exercises : Exercise[],
        @Body("loop") loop: number,
        @Body("songChoice") songChoice: string,
        @Body("resolutionWidth") resolutionWidth : number,
        @Body("resolutionHeight") resolutionHeight : number,
        @Request() req
    ) {
      return this.workoutService.createWorkout(workoutTitle, workoutDescription, exercises, loop, songChoice, resolutionWidth, resolutionHeight, req.user.userID, this.ctx)
    }

    /**
     *Workout Service - Update Workout
     *
     * @param workoutID this is the string ID of the workout to be updated
     * @param workoutTitle This is the string workout title
     * @param workoutDescription This is the string workout description
     * @param exercises This is an array of exercises
     * @param loop Duration each each exercise pose in seconds
     * @param songChoice Genre choice for background track
     * @param resolutionWidth The width of the resolution
     * @param resolutionHeight The height of the resolution
     * @param req This contains the User object of the User currently logged in [from this the string User id is retrieved]
     * @throws PreconditionFailedException if:
     *                               -Parameters can not be left empty.
     *
     * @return  Message indicating success.
     * @author Msi Sibanyoni
     *
     */
    @UseGuards(JwtAuthGuard)
    @Put("updateWorkout")
    @ApiBody({ type: UpdateWorkoutDTO })
    @ApiOkResponse({
      description: "Workout Updated"
    })
    @ApiBadRequestResponse({
      description: "Could not update workout."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    @ApiBearerAuth()
    async updateWorkout (
        @Body("workoutID") workoutID: string,
        @Body("workoutTitle") workoutTitle: string,
        @Body("workoutDescription") workoutDescription: string,
        @Body("exercises") exercises : Exercise[],
        @Body("loop") loop: number,
        @Body("songChoice") songChoice: string,
        @Body("resolutionWidth") resolutionWidth : number,
        @Body("resolutionHeight") resolutionHeight : number,
        @Request() req
    ) {
      return this.workoutService.updateWorkout(workoutID, workoutTitle, workoutDescription, exercises, loop, songChoice, resolutionWidth, resolutionHeight, req.user.userID, this.ctx)
    }

    /**
     *Workout Service - Delete Workout
     *
     * @param workoutID this is the string ID of the workout to be delete
     * @throws PreconditionFailedException if:
     *                               -Parameters can not be left empty.
     *
     * @throws NotFoundException if:
     *                               -Workout with provided ID does not exist.
     *
     * @return  Message indicating success.
     * @author Msi Sibanyoni
     *
     */
    @UseGuards(JwtAuthGuard)
    @Delete("deleteWorkout")
    @ApiBody({ type: DeleteWorkoutDTO })
    @ApiOkResponse({
      description: "Workout Deleted."
    })
    @ApiNotFoundResponse({
      description: "Workout with provided ID does not exist"
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    async deleteWorkout (
        @Body("workoutID") workoutID: string
    ) {
      return this.workoutService.deleteWorkout(workoutID, this.ctx)
    }

    /**
     *Workout Controller - Create Tag
     *
     * @param label This is the title of the tag.
     * @param textColour This is the text colour of the tag.
     * @param backgroundColour  This is the background colour of the tag.
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws NotAcceptableException if:
     *                               -There is any type of profanity found in the label, using npm 'bad-words'.
     * @throws ConflictException if:
     *                               -There is already a tag that exists in the database with the given label.
     * @throws BadRequestException if:
     *                               -There is a precondition net met, such as parameters not given.
     * @return  Promise tag object.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Post("createTag")
    @ApiOkResponse({
      description: "Successfully created Tag."
    })
    @ApiNotAcceptableResponse({
      description: "Profanity contained in label title."
    })
    @ApiPreconditionFailedResponse({
      description: "Parameter can not be left empty."
    })
    @ApiConflictResponse({
      description: "Label already exists in database."
    })
    @ApiBadRequestResponse({
      description: "Could not create tag."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    @ApiBody({ type: createTagDTO })
    createTag (
        @Body("label") label: string,
        @Body("textColour") textColour: string,
        @Body("backgroundColour") backgroundColour: string
    ) {
      return this.workoutService.createTag(label, textColour, backgroundColour, this.ctx)
    }

    /**
     *Workout Controller - Get Tags
     *
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No tags were found in the database.
     * @return  Promise array of tag object/s.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("getTags")
    @ApiOkResponse({
      description: "Successfully created Tag."
    })
    @ApiNotFoundResponse({
      description: "No tags were found in the database."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    getTags (
    ) {
      return this.workoutService.getTags(this.ctx)
    }

    /**
     *Workout Controller - createTTS
     *
     * @param text This parameter includes the string that needs to be converted to a .wav file (Audio file).
     * @param fileName  This is the name of the file that will be stored on the server.
     * @throws BadRequestException if:
     *                               -Conversion from text to speech has failed.
     * @return  Message indicating success (text file has been created).
     * @author Zelealem Tesema
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("createTTS")
    createTTS (
      @Body("text") text: string,
      @Body("fileName") fileName: string
    ) {
      return this.workoutService.textToSpeech(text, fileName)
    }

    /**
     *Workout Controller - Create Video
     *
     * @param workoutID  The workout ID
     * @param loop Duration each each exercise pose in seconds
     * @param songChoice Genre choice for background track
     * @param resolutionWidth The width of the resolution
     * @param resolutionHeight The height of the resolution
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workout was found in the database with the specified workout ID.
     * @throws ApiPreconditionFailedResponse if:
     *                               -Invalid Workout ID passed in.
     * @throws ApiServiceUnavailableResponse if:
     *                               -Unable to create video.
     * @throws ApiInternalServerErrorResponse if:
     *                               -Internal server error.
     * @return  Message indicating success.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Post("createVideo")
    @ApiBody({ type: createVideoDTO })
    @ApiCreatedResponse({
      description: "Successfully created video."
    })
    @ApiPreconditionFailedResponse({
      description: "Invalid Workout object passed in."
    })
    @ApiNotFoundResponse({
      description: "No workout was found in the database with the specified workout ID."
    })
    @ApiServiceUnavailableResponse({
      description: "Unable to create video."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    createVideo (
        @Body("workoutID") workoutID: string,
        @Body("loop") loop: number,
        @Body("songChoice") songChoice: string,
        @Body("resolutionWidth") resolutionWidth : number,
        @Body("resolutionHeight") resolutionHeight : number
    ) {
      return this.workoutService.createVideo(workoutID, loop, songChoice, resolutionWidth, resolutionHeight, this.ctx)
    }

    /**
     *Workout Controller - Mix Audio
     *
     * @description Helper function for createVideo. Merges tts with audio soundtrack
     * @param workoutID  The workout ID
     * @param exerciseID  Array of exercise ID's
     * @param numberOfTimes  The number of times of pose needs to loop
     * @param loop Duration each exercise pose in seconds
     * @param songChoice Genre choice for background track
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("mixAudio")
    mixAudiio (
        @Body("workoutID") workoutID: string,
        @Body("exerciseID") exerciseID: string[],
        @Body("numberOfTimes") numberOfTimes: number[],
        @Body("loop") loop: number,
        @Body("songChoice") songChoice: string
    ) {
      return this.workoutService.mixAudio(workoutID, exerciseID, numberOfTimes, loop, songChoice)
    }

    /**
     *Workout Controller - Get Workout PDF
     *
     * @param workoutID - id of workout pdf to be returned
     * @throws NotAcceptableException if: -No ID was passed in.
     * @throws BadRequestException if: - cannot return workout pdf
     * @return Workout PDF
     * @author Msi Sibanyoni
     *
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("getWorkoutPDF/:workoutID")
    @ApiOkResponse({
      description: "A workout pdf."
    })
    getWorkoutPDF (
      @Param("workoutID") workoutID: string
    ) {
      return this.workoutService.getWorkoutPDF(workoutID, this.ctx)
    }

    /**
     *Workout Controller - Get Workout Video
     *
     * @param workoutID  The workout ID
     * @param this.ctx  This is the prisma context that is injected into the function.
     * @throws ApiPreconditionFailedResponse if: -Invalid Workout ID passed in.
     * @throws NotFoundException if: -Workout video does not exist.
     * @throws BadRequestException if: - Cannot return workout video
     * @return  Promise array of tag object/s.
     * @author Tinashe Chamisa
     *
     */
    @UseGuards(JwtAuthGuard)
    @Get("getWorkoutVideo/:workoutID")
    @ApiBody({ type: getWorkoutVideoDTO })
    @ApiCreatedResponse({
      description: "Successfully created video."
    })
    @ApiPreconditionFailedResponse({
      description: "Invalid Workout object passed in."
    })
    @ApiNotFoundResponse({
      description: "Workout video does not exist."
    })
    @ApiBadRequestResponse({
      description: "Cannot return video."
    })
    @ApiInternalServerErrorResponse({
      description: "Internal server error."
    })
    getWorkoutVideo (
        @Param("workoutID") workoutID: string
    ) {
      return this.workoutService.getWorkoutVideo(workoutID, this.ctx)
    }
}
