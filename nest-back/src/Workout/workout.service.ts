import {
    BadRequestException, ConflictException,
    Injectable,
    NotAcceptableException,
    NotFoundException, PreconditionFailedException
} from "@nestjs/common";

import { Context } from "../../context";
import {v4 as uuidv4 } from 'uuid';

import {
    Workout,
    Exercise,
    User,
    Tag,
    Prisma
} from '@prisma/client';
import { jsPDF } from "jspdf";
import {PrismaService} from "../Prisma/prisma.service";
import {
    ApiBody,
    ApiCreatedResponse, ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse, ApiParam, ApiProperty, ApiQuery,
    ApiResponse
} from "@nestjs/swagger";

const Filter = require('bad-words'), filter = new Filter();

@Injectable()
export class WorkoutService{

    constructor(private prisma: PrismaService) {
    }

    /**
     *Workout service - format
     *
     * @brief Function that formats a string so that every first letter of every word is a capital, eg: CoRE extreme to Core Extreme.
     * @param label This is the label that will be formatted.
     * @return  Re-formatted string.
     * @author Tinashe Chamisa
     *
     */
    format(label: string): string{
        let str = label.toLowerCase();
        const arr = str.split(" ");
        //loop through each element of the array and capitalize the first letter.
        for(let i=0; i<arr.length; i++){
            arr[i]= arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        //Join all the elements of the array back into a string using a blank space as a separator
        str = arr.join(" ");
        return str;
    }

    /**
     *Workout Service - Get Workouts
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
    async getWorkouts(ctx: Context): Promise<any> {
        try{
            const workouts = await ctx.prisma.workout.findMany({//search for workouts that meet the requirement
                select: {
                    workoutID: true,
                    workoutTitle: true,
                    workoutDescription: true,
                    exercises: true,
                    tags: true,
                    planner_ID: true
                }
            });

            if(!(Array.isArray(workouts) && workouts.length)){//if JSON object is empty, send error code
                throw new NotFoundException("No workouts were found in the database.");
            }
            else{
                return workouts;
            }
        }
        catch(err){
            throw err;
        }
    }

    /**
     *Workout Service - Get Workouts by ID
     *
     * @param id This is the ID of the workout to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified ID.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
    async getWorkoutById(id: string, ctx: Context): Promise<any> {
        try{
            const workouts = await ctx.prisma.workout.findMany({//search for workouts that meet the requirement
                where: {
                    workoutID: id
                },
                select: {
                    workoutID: true,
                    workoutTitle: true,
                    workoutDescription: true,
                    exercises: true,
                    tags: true,
                    planner_ID: true
                }
            });

            if(!(Array.isArray(workouts) && workouts.length)){//if JSON object is empty, send error code
                throw new NotFoundException("No workouts were found in the database with the specified id.");
            }
            else{
                return workouts;
            }
        }
        catch(err){
            throw err;
        }
    }

    /**
     *Workout Service - Get Exercises
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No exercises were found in the database.
     * @return  Promise array of exercise object/s.
     * @author Tinashe Chamisa
     *
     */
    async getExercises(ctx: Context): Promise<any> {
        try{
            const exercises = await ctx.prisma.exercise.findMany({//search for exercises that meet the requirement
                select: {
                    exercise: true,
                    title: true,
                    description: true,
                    repRange: true,
                    sets: true,
                    Posedescription: true,
                    restPeriod: true,
                    tags: true,
                    duratime: true
                }
            });

            if(!(Array.isArray(exercises) && exercises.length)){//if JSON object is empty, send error code
                throw new NotFoundException("No exercises were found in the database.");
            }

            return exercises;
        }
        catch(err){
            throw err;
        }
    }

    /**
     *Workout Service - Get Exercises by Title
     *
     * @param title This is the title of the exercise/s to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No exercises were found in the database with the specified title.
     * @return  Promise array of exercises object/s.
     * @author Tinashe Chamisa
     *
     */
    async getExerciseByTitle(title: string, ctx: Context): Promise<any> {
        try{
            const exercise = await ctx.prisma.exercise.findMany({//search for exercises that meet the requirement
                where: {
                    title : title
                },
                select: {
                    exercise: true,
                    title: true,
                    description: true,
                    repRange: true,
                    sets: true,
                    Posedescription: true,
                    restPeriod: true,
                    tags: true,
                    duratime: true
                }
            });

            if(!(Array.isArray(exercise) && exercise.length)){//if JSON object is empty, send error code
                throw new NotFoundException("No exercises were found in the database with the specified title.");
            }
            else{
                return exercise;
            }
        }
        catch(err){
            throw err;
        }
    }


    async getExerciseByID(id: string, ctx: Context): Promise<any> {
        try{
            const exercise = await ctx.prisma.exercise.findUnique({//search for exercises that meet the requirement
                where: {
                    exercise : id
                },
                select: {
                    exercise: true,
                    title: true,
                    description: true,
                    repRange: true,
                    sets: true,
                    Posedescription: true,
                    restPeriod: true,
                    tags: true,
                    duratime: true
                }
            });
            if(exercise==null){//if JSON object is empty, send error code
                throw new NotFoundException("No exercise was found in the database with the specified ID.");
            }
            else{
                return exercise;
            }
        }
        catch(err){
            throw err;
        }
    }

    /**
     *Workout Service - Get Workouts by Planner
     *
     * @param id This is the ID of the planner of the workout/s to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified planner ID.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
    async getWorkoutByPlanner(id: string, ctx: Context): Promise<any> {
        try {
            const workouts = await ctx.prisma.workout.findMany({//search for workouts that meet the requirement
                where: {
                    planner_ID: id
                },
                select: {
                    workoutID: true,
                    workoutTitle: true,
                    workoutDescription: true,
                    exercises: true,
                    tags: true,
                    planner_ID: true
                }
            });
            if (!(Array.isArray(workouts) && workouts.length)) {//if JSON object is empty, send error code
                throw new NotFoundException("No workouts were found in the database with the specified planner.");
            } else {
                return workouts;
            }
        } catch (err) {
            throw err;
        }
    }


    async createExercise(title:string,description:string,repRange:string,sets:number,poseDescription:string,restPeriod:number,tags:Tag[],duratime:number, ctx: Context){

        if (title=="" || description=="" || repRange=="" || sets==0 || poseDescription=="" || restPeriod==0 || duratime==0 )
        {
            throw new NotFoundException("Parameters can not be left empty.");
        }

        if(tags != null){
            await this.addNewTags(tags,ctx);
            let tagConnection = tags.map( n => {
                const container = {
                    label: n.label
                };

                return container;
            });
            let Exercise = {
                title: title,
                description: description,
                repRange: repRange,
                sets: sets,
                Posedescription: poseDescription,
                restPeriod: restPeriod,
                duratime: duratime,
                tags: {
                    connect: tagConnection
                }
            }
            await ctx.prisma.exercise.create({
                data:Exercise
            })
            return("Exercise created.");
        }else{
            let Exercise = {
                title: title,
                description: description,
                repRange: repRange,
                sets: sets,
                Posedescription: poseDescription,
                restPeriod: restPeriod,
                duratime: duratime,
            }
            await ctx.prisma.exercise.create({
                data:Exercise
            })
            return("Exercise created.");
        }

    }

    /**
     *Workout Service - Update Exercise
     *
     * @param exercise This is the ID of the exercise.
     * @param title This is the title of the exercise.
     * @param description This is the description of the exercise.
     * @param repRange This is the amount of reps.
     * @param sets This is the amount of sets.
     * @param Posedescription This is the pose description.
     * @param restPeriod This is the rest period of the exercise.
     * @param difficulty This is the difficulty of the exercise.
     * @param duratime This is the duration of the exercise.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws PreconditionFailedException if:
     *                               -Not all parameters are given.
     * @throws NotFoundException if:
     *                               -An exercise with provided ID does not exist.
     * @return  Message indicating success.
     * @author Tinashe Chamisa
     *
     */
    async updateExercise(exercise: string, title: string,description: string,repRange: string,sets: number,Posedescription: string,restPeriod: number,tags: Tag[],duratime: number, ctx: Context): Promise<any> {
        if(exercise=="" || title=="" || description=="" || repRange=="" || sets==null || title=="" || Posedescription=="" || restPeriod==null || duratime==null){
            throw new PreconditionFailedException("Invalid exercise object passed in.")
        }

        try{
            const Exercise = await ctx.prisma.exercise.findMany({
                where: {
                    exercise
                },
                select: {
                    exercise: true
                }
            });

            if(!(Array.isArray(Exercise) && Exercise.length)){
                throw new NotFoundException("Exercise with provided ID does not exist.");
            }

            if(tags!= null) { //run update query with tags
                await this.addNewTags(tags, ctx);
                let tagConnection = tags.map(n => {
                    const container = {
                        label: n.label
                    };

                    return container;
                });
                await ctx.prisma.exercise.update({
                    where:{
                        exercise
                    },
                    data:{
                        exercise,
                        title,
                        description,
                        repRange,
                        sets,
                        Posedescription,
                        restPeriod,
                        tags: {
                            connect:tagConnection
                        },
                        duratime
                    }
                });

                return "Exercise updated."
            }else{
                await ctx.prisma.exercise.update({
                    where:{
                        exercise
                    },
                    data:{
                        exercise,
                        title,
                        description,
                        repRange,
                        sets,
                        Posedescription,
                        restPeriod,
                        duratime
                    }
                });

                return "Exercise updated."
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     *Workout Service - Delete Exercise
     *
     * @param exercise This is the ID of the exercise.
     * @throws PreconditionFailedException if:
     *                               -Parameter can not be left empty.
     * @throws NotFoundException if:
     *                               -An exercise with provided ID does not exist.
     * @return  Message indicating success.
     * @author Tinashe Chamisa
     *
     */
    async deleteExercise(exercise: string, ctx: Context): Promise<any> {
        if(exercise ==""){
            throw new PreconditionFailedException("Parameter can not be left empty.")
        }
        try{
            await ctx.prisma.exercise.delete({
                where:{
                    exercise
                }
            });
            return("Exercise Deleted.");
        }catch (e) {
            throw new NotFoundException("Exercise with provided ID does not exist");
        }
    }

    async createWorkout(workoutTitle: string, workoutDescription: string, exercises : Exercise[],tags:Tag[],planner_ID :string,ctx: Context) {
        if (workoutTitle=="" || workoutDescription==""  ){
            throw new NotFoundException("Parameters can not be left empty.");
        }
        if(tags!= null){ //run create query with tags
            await this.addNewTags(tags,ctx);
            let tagConnection = tags.map( n => {
                const container = {
                    label: n.label
                };

                return container;
            });
            const Workout ={
                workoutTitle: workoutTitle,
                workoutDescription: workoutDescription,
                exercises: {
                    connect: exercises
                },
                tags: {
                    connect:tagConnection
                },
                planner: {
                    connect: {
                        userId: planner_ID
                    }
                }
            }
            await ctx.prisma.workout.create({
                data: Workout
            })
            await this.generateWorkoutPDF(Workout, ctx);
            return("Workout Created.");

        }else{ //run create query without tags
            const Workout ={
                workoutTitle: workoutTitle,
                workoutDescription: workoutDescription,
                exercises: {
                    connect: exercises
                },
                planner: {
                    connect: {
                        userId: planner_ID
                    }
                }
            }
            await ctx.prisma.workout.create({
                data: Workout
            })
            await this.generateWorkoutPDF(Workout, ctx);
            return("Workout Created.");
        }


    }

    async updateWorkout(workoutID: string, workoutTitle: string, workoutDescription: string, exercises : Exercise[],tags:Tag[],planner_ID :string,ctx: Context){
        if (workoutID == "" || workoutTitle=="" || workoutDescription=="" ){
            throw new NotFoundException("Parameters can not be left empty.");
        }
        if(tags!= null) { //run update query with tags
            await this.addNewTags(tags, ctx);
            let tagConnection = tags.map(n => {
                const container = {
                    label: n.label
                };

                return container;
            });
            const updateWorkout ={
                workoutTitle: workoutTitle,
                workoutDescription: workoutDescription,
                exercises: {
                    connect: exercises
                },
                tags: {
                    connect:tagConnection
                },
                planner: {
                    connect: {
                        userId: planner_ID
                    }
                }
            }
            try{
                await ctx.prisma.workout.update({
                    where:{
                        workoutID: workoutID,
                    },
                    data:updateWorkout
                });
                await this.generateWorkoutPDF(updateWorkout, ctx);
                return("Workout Updated.");
            }catch (e) {
                throw new NotFoundException("Workout with provided ID does not exist");
            }
        }else{
            const updateWorkout ={
                workoutTitle: workoutTitle,
                workoutDescription: workoutDescription,
                exercises: {
                    connect: exercises
                },
                planner: {
                    connect: {
                        userId: planner_ID
                    }
                }
            }
            try{
                await ctx.prisma.workout.update({
                    where:{
                        workoutID: workoutID,
                    },
                    data:updateWorkout
                });
                await this.generateWorkoutPDF(updateWorkout, ctx);
                return("Workout Updated.");
            }catch (e) {
                throw new NotFoundException("Workout with provided ID does not exist");
            }
        }


    }

    async deleteWorkout(workoutID: string,ctx: Context){
        if(workoutID ==""){
            throw new NotFoundException("Parameters can not be left empty.");
        }
        try{
            await ctx.prisma.workout.delete({
                where:{
                    workoutID: workoutID
                }
            });
            return("Workout Deleted.");
        }catch (e) {
            throw new NotFoundException("Workout with provided ID does not exist");
        }
    }

    async generateWorkoutPDF(workout: any, ctx: Context){

        const doc = new jsPDF();

        //TODO: Make heading font and a normal font & Consider adding an image
        doc.text(workout.workoutTitle, 80, 10);
        // if(workout.tags ){
        //     let stringTags = workout.tags.label.join();
        //     let splitTags = doc.splitTextToSize(stringTags,180);
        //     doc.text("Tags: " + splitTags, 15 , 50  );
        // }

        let splitWorkoutDesc = doc.splitTextToSize(workout.workoutDescription,180);
        doc.text(splitWorkoutDesc, 15, 130 );
        //doc.addImage("./src/GeneratedWorkouts/Kenzo_logo.png","PNG",60,230,90, 40);


        if(workout.exercises.connect === undefined){
            doc.save("./src/GeneratedWorkouts/" + workout.workoutTitle + "Workout.pdf");
        }else{

            for(let i =0; i < workout.exercises.connect.length ; i++){
                let exercise = await this.getExerciseByID(workout.exercises.connect[i].exercise, ctx);
                //console.log(exercise);
                doc.addPage("a4", "p");
                doc.text(exercise.title, 90, 10);
                // if(exercise.tags){
                //     let stringTags = exercise.tags.label.join()
                //     let splitTags = doc.splitTextToSize(stringTags,180);
                //     doc.text("Tags: " + splitTags, 15 , 30  );
                // }

                let splitExerciseDesc = doc.splitTextToSize(exercise.description,180)
                doc.text(splitExerciseDesc, 15, 50);
                doc.text("Rep Range: " + exercise.repRange, 15, (60+(splitExerciseDesc.length*10)) );
                doc.text("Sets: " + exercise.sets.toString(), 90, (60+(splitExerciseDesc.length*10)) );
                //doc.text(exercise.Posedescription, 10, 90);
                doc.text("Rest Period: " + exercise.restPeriod.toString() + " seconds.", 15, (80+(splitExerciseDesc.length*10)) );
                doc.text("Exercise Duration: " + exercise.duratime.toString() + " seconds or " + (exercise.duratime/60).toString() + " minutes", 15, (100+(splitExerciseDesc.length*10)) );
            }
            doc.save("./src/GeneratedWorkouts/" + workout.workoutTitle + "Workout.pdf");
        }

    }

    /**
     *Workout Service - Create Tag
     *
     * @param label This is the title of the tag.
     * @param textColour This is the text colour of the tag.
     * @param backgroundColour  This is the background colour of the tag.
     * @param ctx  This is the prisma context that is injected into the function.
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
    async createTag(label: string,textColour: string,backgroundColour: string, ctx: Context): Promise<any> {
        if(filter.isProfane(label)){
            throw new NotAcceptableException("Profanity contained in label title.");
        }
        try {
            label  = this.format(label);
            const find = await ctx.prisma.tag.findUnique({//search for tags that meet the requirement
                where: {
                    label
                },
                select: {
                    label: true
                }
            });

            if(find!=null){//if duplicates are detected, throw error
                throw new ConflictException("Duplicate", "Label already exists in database.")
            }

            const createdUser= await ctx.prisma.tag.create({
                data: {
                    label,
                    textColour,
                    backgroundColour
                },
            })
            if (createdUser==null) {//if JSON object is empty, send error code
                throw new BadRequestException("Could not create tag.");
            }

            return createdUser;
        } catch (err) {
            throw err;
        }
    }

    /**
     *Workout Service - Get Tags
     *
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No tags were found in the database.
     * @return  Promise array of tag object/s.
     * @author Tinashe Chamisa
     *
     */
    async getTags(ctx: Context): Promise<any> {
        try{
            const tags = await ctx.prisma.tag.findMany({//search and retrieve all tags
                select: {
                    label: true,
                    textColour: true,
                    backgroundColour: true,
                }
            });

            if(tags.length==0){//if JSON object is empty, send error code
                throw new NotFoundException("No tags were found in the database.");
            }

            return tags;
        }
        catch(err){
            throw err;
        }
    }


    async addNewTags(tags: Tag[], ctx:Context){
        for(let i = 0;i<tags.length;i++){
            tags[i].label = this.format(tags[i].label);
        }
        tags.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));

        //check if there are any tags in database
        const tagCount = await ctx.prisma.tag.count();
        if(tagCount === 0){//if none add from input tags
            for(let i = 0; i<tags.length ; i++){
                await this.createTag(tags[i].label,tags[i].textColour,tags[i].backgroundColour,ctx);
            }
        }else{//find uncommon tags and add them to tags table
            let databaseTags = await this.getTags(ctx);
            const uncommonElements = tags.filter( ({label:label1}) => !databaseTags.some(({ label: label2 }) => label1 === label2) );
            if(uncommonElements.length == 0){
                return;
            }else{
                for(let i = 0; i<uncommonElements.length ; i++){
                    await this.createTag(uncommonElements[i].label,uncommonElements[i].textColour,uncommonElements[i].backgroundColour,ctx);
                }
            }

        }

    }

}