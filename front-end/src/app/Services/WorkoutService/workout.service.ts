import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
    console.log(UserDetails);

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
}
