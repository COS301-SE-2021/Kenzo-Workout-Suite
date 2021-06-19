import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Workout} from "../../Models/workout";
import {Exercise} from "../../Models/exercise";
import { UserService } from "../UserService/user.service";

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  constructor(private http:HttpClient,
              private userService: UserService) {}

  /** This function attempts to submit a workout by using the following parameters:
   *
   * @param workout represents a Workout Object that will hold the necessary data for creating a workout.
   *
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, user error and server error, respectively.
   */
  async attemptSubmitWorkout(workout:Workout) : Promise<Number> {
    const url : string = "http://localhost:3000/workout/createWorkout";

    let UserDetails = await this.userService.obtainUserDetails();

    const body:Object = {
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "planner_ID": UserDetails["planner_ID"]
    };

    return this.http.post(url, body).toPromise().then(data=>{
      return 200;
    }).catch(error=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  /** This function attempts to submit an exercise by using the following parameters:
   *
   * @param exercise represents an Exercise Object that will hold the necessary data for creating an exercise.
   *
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, user error and server error, respectively.
   */
  async attemptSubmitExercise(exercise:Exercise) : Promise<Number> {
    const url : string = "http://localhost:3000/workout/createExercise";

    const body:Object = {
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "poseDescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "duratime": exercise.duratime
    };

    return this.http.post(url, body).toPromise().then(data=>{
      return 200;
    }).catch(error=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  /**
   * attempt to get all the workouts in the database for the library page
   */
  async attemptGetWorkouts() : Promise<any>{
    const url: string = "http://localhost:3000/workout/getWorkouts";
    return this.http.get(url).toPromise().then(data=>{
      data = {
        status: 200,
        data: data
      }
      return data
    }).catch(err=>{
      return err;
    });
  }

  /**
   * attempt to get all the exercises in the database for the library page
   */
  async attemptGetExercises() : Promise<any>{
    const url: string = "http://localhost:3000/workout/getExercises";
    return this.http.get(url).toPromise().then(data=>{
      data = {
        status: 200,
        data: data
      }
      return data
    }).catch(err=>{
      return err;
    });
  }

  async attemptGetWorkoutsByPlanner() : Promise<any>{
    const url: string = "http://localhost:3000/workout/getWorkoutByPlanner";

    return this.http.get(url).toPromise().then(data=>{
      data = {
        status: 200,
        data: data
      }
      return data;
    }).catch(error=>{
      if(error.status==0 || error.status == 500) return 500;
      return 404;
    });
  }

  async attemptGetExercisesByPlanner() : Promise<any>{
    const url: string = "http://localhost:3000/workout/getExerciseByPlanner";
    // let UserDetails = await this.userService.obtainUserDetails();
    // let headers = new HttpHeaders();
    // headers.append('header', 'application/json');
    // let params = new HttpParams();
    // params.append('param',UserDetails["planner_ID"]);

    return this.http.get(url).toPromise().then(data=>{
      data = {
        status: 200,
        data: data
      }
      return data;
    }).catch(error=>{
      if(error.status==0 || error.status == 500) return 500;
      return 404;
    });
  }
}
