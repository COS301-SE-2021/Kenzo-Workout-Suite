import {
    BadRequestException, ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException, NotAcceptableException,
    NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";

import {
    Workout,
    Exercise,
    Prisma
} from '@prisma/client';
import {Context} from "../../context";
const Filter = require('bad-words'), filter = new Filter();

@Injectable()
export class WorkoutService{

    constructor(private prisma: PrismaService) {
    }

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

    async getTags(ctx: Context): Promise<any> {
        try{
            const tags = await ctx.prisma.tag.findMany({//search and retrieve all tags
                select: {
                    label: true,
                    textColour: true,
                    backgroundColour: true,
                }
            });

            if(tags==null){//if JSON object is empty, send error code
                throw new NotFoundException("No tags were found in the database.");
            }

            return tags;
        }
        catch(err){
            throw err;
        }
    }

}