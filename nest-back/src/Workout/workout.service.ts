import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import { Context } from "../../context";
import {v4 as uuidv4 } from 'uuid';

import {
    Workout,
    Exercise,
    User,
    Difficulty,
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




@Injectable()
export class WorkoutService{
    //private static prisma: PrismaService;

    constructor(prisma : PrismaService) {
    }

    async getWorkouts(ctx: Context): Promise<any> {
        try{
            const workouts = await ctx.prisma.workout.findMany({//search for workouts that meet the requirement
                select: {
                    workoutID: true,
                    workoutTitle: true,
                    workoutDescription: true,
                    exercises: true,
                    difficulty: true,
                    planner_ID: true
                }
            });

            if(workouts==null){//if JSON object is empty, send error code
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

    async getWorkoutById(id: string, ctx: Context): Promise<any> {
        try{
            const workouts = await ctx.prisma.workout.findUnique({//search for workouts that meet the requirement
                where: {
                    workoutID: id
                },
                select: {
                    workoutID: true,
                    workoutTitle: true,
                    workoutDescription: true,
                    exercises: true,
                    difficulty: true,
                    planner_ID: true
                }
            });

            if(workouts==null){//if JSON object is empty, send error code
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
                    difficulty: true,
                    duratime: true
                }
            });

            if(exercises==null){//if JSON object is empty, send error code
                throw new NotFoundException("No exercises were found in the database.");
            }

            return exercises;
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
                    difficulty: true,
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
                    difficulty: true,
                    planner_ID: true
                }
            });
            if (workouts==null) {//if JSON object is empty, send error code
                throw new NotFoundException("No workouts were found in the database with the specified planner.");
            } else {
                return workouts;
            }
        } catch (err) {
            throw err;
        }
    }

    async createExercise(title:string,description:string,repRange:string,sets:number,poseDescription:string,restPeriod:number,difficulty:Difficulty,duratime:number, ctx: Context){
        const Exercise = {
            title: title,
            description: description,
            repRange: repRange,
            sets: sets,
            Posedescription: poseDescription,
            restPeriod: restPeriod,
            difficulty: difficulty,
            duratime: duratime
        }
        if (title=="" || description=="" || repRange=="" || sets==0 || poseDescription=="" || restPeriod==0  || difficulty==null  || duratime==0 )
        {
            throw new NotFoundException("Parameters can not be left empty.");
        }
        await ctx.prisma.exercise.create({
            data:Exercise
        })
        return("Exercise created.");

    }

    async createWorkout(workoutTitle: string, workoutDescription: string, exercises : Exercise[],difficulty:Difficulty,planner_ID :string,ctx: Context) {
        if (workoutTitle=="" || workoutDescription=="" || difficulty==null ){
            throw new NotFoundException("Parameters can not be left empty.");
        }
        const Workout ={
            workoutTitle: workoutTitle,
            workoutDescription: workoutDescription,
            exercises: {
                connect: exercises
            },
            difficulty: difficulty,
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

    async updateWorkout(workoutID: string, workoutTitle: string, workoutDescription: string, exercises : Exercise[],difficulty:Difficulty,planner_ID :string,ctx: Context){
        if (workoutID == "" || workoutTitle=="" || workoutDescription=="" || difficulty==null ){
            throw new NotFoundException("Parameters can not be left empty.");
        }
        const updateWorkout ={
            workoutTitle: workoutTitle,
            workoutDescription: workoutDescription,
            exercises: {
                connect: exercises
            },
            difficulty: difficulty,
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
            //console.log(e);
            throw new NotFoundException("Workout with provided ID does not exist");
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
        doc.text("Difficulty: " + workout.difficulty, 80 , 50  );
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
                doc.text("Difficulty: " + exercise.difficulty, 80, 30);
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


}

