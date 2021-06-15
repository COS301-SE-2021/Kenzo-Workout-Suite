import {HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
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

    constructor() {
    }

    validateEmail(email) {//function to validate an email
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    isEmptyObject(obj) {//function to check whether a JSON object is empty or not
        return !Object.keys(obj).length;
    }

    // async getWorkouts(){
    //     try{
    //         const workouts = await this.prisma.workout.findMany({//search for workouts that meet the requirement
    //             select: {
    //                 workoutTitle: true,
    //                 workoutDescription: true,
    //                 exercises: true,
    //                 difficulty: true,
    //                 planner_Email: true
    //             }
    //         });
    //
    //         if(this.isEmptyObject(workouts)){//if JSON object is empty, send error code
    //             throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    //         }
    //         else{
    //             return workouts;
    //         }
    //     }
    //     catch(err){
    //         throw new HttpException(err, HttpStatus.SERVICE_UNAVAILABLE);
    //     }
    // }

    getWorkoutByTitle(title: string){

    }

    getExerciseByTitle(title: string){

    }

    getWorkoutByPlanner(email: string){

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

