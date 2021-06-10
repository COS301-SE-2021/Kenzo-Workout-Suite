import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Workout} from "../../Models/workout";

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  constructor(private http:HttpClient) {}

  /**
   *
   * @param workout
   */
  async attemptSubmitWorkout(workout:Workout) : Promise<Number> {
    const url : string = "http://localhost:5500/workout/createWorkout";

    const body:Object = {
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "difficulty": workout.difficulty
    };

    return this.http.post(url, body).toPromise().then(data=>{
      return 200;
    }).catch(error=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  async attemptGetWorkouts() : Promise<any>{
    const url: string = "http://localhost:5500/workout/getworkout"
    return this.http.get(url, {responseType: 'json'}).toPromise();
  }
}
