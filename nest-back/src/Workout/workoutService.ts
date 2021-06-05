import {HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";

import {
    Workout,
    Exercise,
    Prisma
} from '@prisma/client';

@Injectable()
export class WorkoutService{

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
                throw new NotFoundException();
            }
            else{
                return workouts;
            }
        }
        catch(err){
            throw new InternalServerErrorException();
        }
    }

    getWorkoutByTitle(title: string){

    }

    getExerciseByTitle(title: string){

    }

    getWorkoutByPlanner(email: string){

    }

    createExercise(title:string,description:string,repRange:string,sets:number,poseDescription:string,restPeriod:number,difficulty:string,duratime:number){

    }

    createWorkout(workoutTitle: string, workoutDescription: string, difficulty: string){

    }

}