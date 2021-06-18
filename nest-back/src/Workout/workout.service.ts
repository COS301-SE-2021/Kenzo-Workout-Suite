import {
    NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../Prisma/prisma.service";
import {Context} from "../../context";

@Injectable()
export class WorkoutService{

    constructor(private prisma: PrismaService) {
    }

    /**
     *Workout Service - Get Workouts
     * @throws NotFoundException if:
     *                               -No workouts were found in the database.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
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

            if(!(Array.isArray(workouts) && workouts.length)){//if JSON object is empty, send error code
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

    /**
     *Workout Service - Get Workouts by ID
     *
     * @param id This is the ID of the workout to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified ID.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
    async getWorkoutById(id: string, ctx: Context): Promise<any> {
        try{
            const workouts = await ctx.prisma.workout.findMany({//search for workouts that meet the requirement
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

            if(!(Array.isArray(workouts) && workouts.length)){//if JSON object is empty, send error code
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

    /**
     *Workout Service - Get Exercises
     * @throws NotFoundException if:
     *                               -No exercises were found in the database.
     * @return  Promise array of exercise object/s.
     * @author Tinashe Chamisa
     *
     */
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

            if(!(Array.isArray(exercises) && exercises.length)){//if JSON object is empty, send error code
                throw new NotFoundException("No exercises were found in the database.");
            }

            return exercises;
        }
        catch(err){
            throw err;
        }
    }

    /**
     *Workout Service - Get Exercises by Title
     *
     * @param title This is the title of the exercise/s to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No exercises were found in the database with the specified title.
     * @return  Promise array of exercises object/s.
     * @author Tinashe Chamisa
     *
     */
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

            if(!(Array.isArray(exercise) && exercise.length)){//if JSON object is empty, send error code
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

    /**
     *Workout Service - Get Workouts by Planner
     *
     * @param id This is the ID of the planner of the workout/s to be found in the database.
     * @param ctx  This is the prisma context that is injected into the function.
     * @throws NotFoundException if:
     *                               -No workouts were found in the database with the specified planner ID.
     * @return  Promise array of workout object/s.
     * @author Tinashe Chamisa
     *
     */
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
            if (!(Array.isArray(workouts) && workouts.length)) {//if JSON object is empty, send error code
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