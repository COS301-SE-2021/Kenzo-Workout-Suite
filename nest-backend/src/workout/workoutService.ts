import {Injectable} from "@nestjs/common";

@Injectable()
export class WorkoutService{

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

    getWorkouts(){

    }
}