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

    async getWorkouts(ctx: Context): Promise<any> {
        try{
            const workouts = await ctx.prisma.workout.findMany({//search for workouts that meet the requirement
                select: {
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
                    planner_ID: true
                }
            });

            if(workouts==null){//if JSON object is empty, send error code
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

    createExercise(title:string,description:string,repRange:string,sets:number,poseDescription:string,restPeriod:number,difficulty:string,duratime:number){

    }

    createWorkout(workoutTitle: string, workoutDescription: string, difficulty: string){

    }

}