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

    async createWorkout(workoutTitle: string, workoutDescription: string, difficulty:Difficulty,planner_Email :string, ctx: Context) {
        const Workout = {
            workoutTitle: workoutTitle,
            workoutDescription: workoutDescription,
            difficulty: difficulty,
            planner_Email: planner_Email
        }
        if (workoutTitle=="" || workoutDescription=="" || difficulty==null )
        {
            throw new NotFoundException("Parameters can not be left empty.");
        }
        await ctx.prisma.workout.create({
            data:Workout
        })
        return("Workout Created.");

    }
}

