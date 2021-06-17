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




@Injectable()
export class WorkoutService{
    //private static prisma: PrismaService;

    constructor(private prisma: PrismaService) {
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
                    difficulty: true,
                    duratime: true
                }
            });

            if(exercise==null){//if JSON object is empty, send error code
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

        if (workoutTitle=="" || workoutDescription=="" || difficulty==null )
        {
            throw new NotFoundException("Parameters can not be left empty.");
        }
        await ctx.prisma.workout.create({
            data: Workout
        })
        await this.generateWorkoutPDF(Workout);
        return("Workout Created.");

    }

    async generateWorkoutPDF(workout: any){

        const doc = new jsPDF();

        //TODO: Make heading font and a normal font
        doc.text(workout.workoutTitle, 10, 10);
        doc.text(workout.difficulty, 10 , 20);
        doc.text(workout.workoutDescription, 10, 30);

        //TODO:Use this to get the fields for an exercise for the pdf
        console.log(workout.exercises.connect[0].exercise);

        doc.text(workout.exercises.connect[0].exercise,10,50);
        // doc.text(workout.exercises.connect[0].description,10,60);
        // doc.text(workout.exercises.connect[0].repRange,10,70);
        // doc.text(workout.exercises.connect[0].sets + " sets",300,70);
        // doc.text(workout.exercises.connect[0].duratime + " Seconds",10,80);
        // doc.text(workout.exercises.connect[0].restPeriod + " Seconds",50,80);
        // doc.text(workout.exercises.connect[0].difficulty + " Seconds",10,90);


        doc.save("./src/GeneratedWorkouts/" + workout.workoutTitle + "Workout.pdf");
    }


}

