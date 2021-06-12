import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";

import {
    Workout,
    Exercise,
    Prisma
} from '@prisma/client';
import {Context} from "../../context";

@Injectable()
export class WorkoutService{

    constructor(private prisma: PrismaService) {
    }

    validateEmail(email) {//function to validate an email
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    isEmptyObject(obj) {//function to check whether a JSON object is empty or not
        return (obj === null);
    }

    async getWorkouts(ctx: Context): Promise<any> {
        try{
            const workouts = await ctx.prisma.workout.findMany({//search for workouts that meet the requirement
                select: {
                    workoutTitle: true,
                    workoutDescription: true,
                    exercises: true,
                    difficulty: true,
                    planner_Email: true
                }
            });

            if(this.isEmptyObject(workouts)){//if JSON object is empty, send error code
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

    async getWorkoutByTitle(title: string, ctx: Context): Promise<any> {
        try{
            const workouts = await ctx.prisma.workout.findMany({//search for workouts that meet the requirement
                where: {
                    workoutTitle: title
                },
                select: {
                    workoutTitle: true,
                    workoutDescription: true,
                    exercises: true,
                    difficulty: true,
                    planner_Email: true
                }
            });

            if(this.isEmptyObject(workouts)){//if JSON object is empty, send error code
                throw new NotFoundException("No workouts were found in the database with the specified title.");
            }
            else{
                return workouts;
            }
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
                    title: true,
                    description: true,
                    repRange: true,
                    sets: true,
                    Posedescription: true,
                    restPeriod: true,
                    difficulty: true,
                    duratime: true,
                    workoutWorkoutID: true
                }
            });

            if(this.isEmptyObject(exercise)){//if JSON object is empty, send error code
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

    async getWorkoutByPlanner(email: string, ctx: Context): Promise<any> {
        if(!this.validateEmail(email)){//first check if email passed is valid
            throw new BadRequestException("Invalid email.");
        }
        else {
            try {
                const workouts = await ctx.prisma.workout.findMany({//search for workouts that meet the requirement
                    where: {
                        planner_Email: email
                    },
                    select: {
                        workoutTitle: true,
                        workoutDescription: true,
                        exercises: true,
                        difficulty: true,
                        planner_Email: true
                    }
                });

                if (this.isEmptyObject(workouts)) {//if JSON object is empty, send error code
                    throw new NotFoundException("No workouts were found in the database with the specified planner.");
                } else {
                    return workouts;
                }
            } catch (err) {
                throw err;
            }
        }
    }

    createExercise(title:string,description:string,repRange:string,sets:number,poseDescription:string,restPeriod:number,difficulty:string,duratime:number){

    }

    createWorkout(workoutTitle: string, workoutDescription: string, difficulty: string){

    }

}