import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Workout} from "../../Models/workout";
import {Exercise} from "../../Models/exercise";
import {UserService} from "../UserService/user.service";

@Injectable({
    providedIn: "root"
})
export class WorkoutService {


    constructor(private http: HttpClient, private user: UserService) {
    }

    /** This function attempts to submit a workout by using the following parameters:
     *
     * @author Luca Azmanov, u19004185
     * @param workout represents a Workout Object that will hold the necessary data for creating a workout.
     *
     * @return Number represents the status of the Http request.
     *
     * @returns 200,400,500 represent a success, User error and server error, respectively.
     */
    async attemptSubmitWorkout(workout: Workout, exercises): Promise<number> {
        const url = "http://localhost:3000/workout/createWorkout";

        const body = {
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:exercises
        };
        return this.http.post(url, body ).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /** This function attempts to update a workout by using the following parameters:
     *
     * @author Luca Azmanov, u19004185
     * @param workout represents a Workout Object that will hold the necessary data for creating a workout.
     * @param id the id corresponding to the workout
     *
     * @return Number represents the status of the Http request.
     *
     * @returns 200,400,500 represent a success, User error and server error, respectively.
     */
    async attemptUpdateWorkout(workout: Workout, id: string): Promise<number> {
        const url = "http://localhost:3000/workout/updateWorkout";

        const body = {
            workoutID:id,
            workoutTitle: workout.title,
            workoutDescription: workout.description,
            exercises:workout.exercises
        };
        return this.http.put(url, body ).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /** This function attempts to remove a workout by using the following parameters:
     *
     * @author Luca Azmanov, u19004185
     * @param id the id corresponding to the workout
     *
     * @return Number represents the status of the Http request.
     *
     * @returns 200,400,500 represent a success, User error and server error, respectively.
     */
    async attemptRemoveWorkout(id: string): Promise<number> {
        const url = "http://localhost:3000/workout/deleteWorkout";
        const body = {
            workoutID:id,
        };

        return this.http.request("delete", url, {body}).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /** This function attempts to submit an exercise by using the following parameters:
     *
     * @author Luca Azmanov, u19004185
     * @param exercise represents an Exercise Object that will hold the necessary data for creating an exercise.
     *
     * @return Number represents the status of the Http request.
     *
     * @returns 200,400,500 represent a success, User error and server error, respectively.
     */
    async attemptSubmitExercise(exercise: Exercise): Promise<number> {
        const url = "http://localhost:3000/workout/createExercise";
        const body = {
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.poseDescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime,
            images: exercise.images
        };
        return this.http.post(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /** This function attempts to update an exercise by using the following parameters:
     *
     * @author Luca Azmanov, u19004185
     * @param exercise represents an Exercise Object that will hold the necessary data for creating an exercise.
     * @param id the id corresponding to the exercise
     * @return Number represents the status of the Http request.
     *
     * @returns 200,400,500 represent a success, User error and server error, respectively.
     */
    async attemptUpdateExercise(exercise: Exercise, id: string): Promise<number> {
        const url = "http://localhost:3000/workout/updateExercise";

        const body = {
            exerciseID:id,
            exerciseTitle: exercise.title,
            exerciseDescription: exercise.description,
            repRange: exercise.repRange,
            sets: exercise.sets,
            poseDescription: exercise.poseDescription,
            restPeriod: exercise.restPeriod,
            tags: exercise.tags,
            duration: exercise.duratime,
            images: exercise.images
        };

        return this.http.put(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /** This function attempts to submit an exercise by using the following parameters:
     *
     * @author Luca Azmanov, u19004185
     * @param id the id corresponding to the exercise
     * @return Number represents the status of the Http request.
     *
     * @returns 200,400,500 represent a success, User error and server error, respectively.
     */
    async attemptRemoveExercise(id: string): Promise<number> {
        const url = "http://localhost:3000/workout/deleteExercise";

        const body = {
            exerciseID:id,
        };

        return this.http.request("delete", url, {body}).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /**
     * attempt to get all the workouts in the database for the library page
     */
    async attemptGetWorkouts(): Promise<any>{
        const url = "http://localhost:3000/workout/getWorkouts";
        return this.http.get(url).toPromise().then(data=>{
            data = {
                status: 200,
                data: data
            };
            return data;
        }).catch(err=>err);
    }

    /**
     * attempt to get all the exercises in the database for the library page
     */
    async attemptGetExercises(): Promise<any>{
        const url = "http://localhost:3000/workout/getExercises";
        return this.http.get(url).toPromise().then(data=>{
            data = {
                status: 200,
                data: data
            };
            return data;
        }).catch(err=>err);
    }

    async attemptGetWorkoutsByPlanner(): Promise<any>{
        const url = "http://localhost:3000/workout/getWorkoutByPlanner";

        return this.http.get(url).toPromise().then(data=>{
            data = {
                status: 200,
                data: data
            };
            return data;
        }).catch(error=>{
            if(error.status===0 || error.status === 500) {
                return 500;
            }
            return 404;
        });
    }

    async attemptGetExercisesByPlanner(): Promise<any>{
        const url = "http://localhost:3000/workout/getExercisesByPlanner";

        return this.http.get(url).toPromise().then(data=>{
            data = {
                status: 200,
                data: data
            };
            return data;
        }).catch(error=>{
            if(error.status===0 || error.status === 500) {
                return 500;
            }
            return 404;
        });
    }

    async getTags(): Promise<any>{
        const url = "http://localhost:3000/workout/getTags";

        return this.http.get(url).toPromise().then(data=>{
            data = {
                status: 200,
                data: data
            };
            return data;
        }).catch(error=>{
            if(error.status===0 || error.status === 500) {
                return 500;
            }
            return 404;
        });
    }
}
