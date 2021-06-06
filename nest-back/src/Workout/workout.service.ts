import {HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import { MockContext, Context, createMockContext } from "../../context";
import { Test, TestingModule } from '@nestjs/testing';

import {
    Workout,
    Exercise,
    Planner,
    Difficulty,
    Prisma
} from '@prisma/client';
import { WorkoutController} from "./workout.controller";
import {randomUUID} from "crypto";




@Injectable()
export class WorkoutService{
    private static prisma: PrismaService;

    constructor(private prisma: PrismaService) {
    }

    validateEmail(email) {//function to validate an email
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    isEmptyObject(obj) {//function to check whether a JSON object is empty or not
        return !Object.keys(obj).length;
    }

    async getWorkouts(){
        try{
            const workouts = await this.prisma.workout.findMany({//search for workouts that meet the requirement
                select: {
                    workoutTitle: true,
                    workoutDescription: true,
                    exercises: true,
                    difficulty: true,
                    planner_Email: true
                }
            });

            if(this.isEmptyObject(workouts)){//if JSON object is empty, send error code
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            }
            else{
                return workouts;
            }
        }
        catch(err){
            throw new HttpException(err, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    getWorkoutByTitle(title: string){

    }

    getExerciseByTitle(title: string){

    }

    getWorkoutByPlanner(email: string){

    }

    static async createExercise(title:string,description:string,repRange:string,sets:number,poseDescription:string,restPeriod:number,difficulty:Difficulty,duratime:number, ctx: Context){

        if (title=="" || description=="" || repRange=="" || sets==0 || poseDescription=="" || restPeriod==0  || difficulty==null  || duratime==0 )
        {
            throw new NotFoundException("Parameters can not be left empty.");
        }
        ctx.prisma.exercise.create({
            data:{
                title: title,
                description: description,
                repRange: repRange,
                sets: sets,
                Posedescription: poseDescription,
                restPeriod: restPeriod,
                difficulty: difficulty,
                duratime: duratime
            }
        })
        return("Exercise created.");

    }

     static async createWorkout(workoutTitle: string, workoutDescription: string, difficulty: Difficulty , ctx: Context) {
        if (workoutTitle=="" || workoutDescription=="" || difficulty==null )
        {
            throw new NotFoundException("Parameters can not be left empty.");
        }
        ctx.prisma.workout.create({
            data:{
                workoutTitle: workoutTitle,
                workoutDescription: workoutDescription,
                difficulty: difficulty
            }
        })
        return("Workout created.");

    }


    async createWorkout(workoutTitle: string, workoutDescription: string, difficulty:Difficulty, ctx: Context) {
        if (workoutTitle=="" || workoutDescription=="" || difficulty==null )
        {
            throw new NotFoundException("Parameters can not be left empty.");
        }
        this.prisma.workout.create({
            data:{
                workoutTitle: workoutTitle,
                workoutDescription: workoutDescription,
                difficulty: difficulty
            }
        })
        return("Workout created.");
    }
}

