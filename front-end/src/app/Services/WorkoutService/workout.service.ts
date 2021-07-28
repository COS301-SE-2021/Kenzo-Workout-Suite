import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Workout} from "../../Models/workout";
import {Exercise} from "../../Models/exercise";
import {UserService} from "../UserService/user.service";
import {Route, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {


  constructor(private http:HttpClient, private user:UserService) {
  }

  /** This function attempts to submit a workout by using the following parameters:
   * @author Luca Azmanov, u19004185
   * @param workout represents a Workout Object that will hold the necessary data for creating a workout.
   *
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, User error and server error, respectively.
   */
  async attemptSubmitWorkout(workout:Workout) : Promise<Number> {
    const url : string = "http://localhost:3000/workout/createWorkout";

    const body:Object = {
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "tags": workout.tags,
      "exercises":[]
    };

    return this.http.post(url, body ).toPromise().then(data=>{
      return 200;
    }).catch(error=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  /** This function attempts to update a workout by using the following parameters:
   * @author Luca Azmanov, u19004185
   * @param workout represents a Workout Object that will hold the necessary data for creating a workout.
   * @param id the id corresponding to the workout
   *
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, User error and server error, respectively.
   */
  async attemptUpdateWorkout(workout:Workout, id:string) : Promise<Number> {
    const url : string = "http://localhost:3000/workout/updateWorkout";

    const body:Object = {
      "workoutID":id,
      "workoutTitle": workout.title,
      "workoutDescription": workout.description,
      "tags": workout.tags,
      "exercises":[]
    };
    return this.http.put(url, body ).toPromise().then(data=>{
      return 200;
    }).catch(error=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  /** This function attempts to remove a workout by using the following parameters:
   * @author Luca Azmanov, u19004185
   * @param id the id corresponding to the workout
   *
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, User error and server error, respectively.
   */
  async attemptRemoveWorkout(id:string) : Promise<Number> {
    const url : string = "http://localhost:3000/workout/deleteWorkout";

    const body:Object = {
      "workoutID":id,
    };

    return this.http.request('delete',url,{body}).toPromise().then(data=>{
      return 200;
    }).catch(error=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  /** This function attempts to submit an exercise by using the following parameters:
   * @author Luca Azmanov, u19004185
   * @param exercise represents an Exercise Object that will hold the necessary data for creating an exercise.
   *
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, User error and server error, respectively.
   */
  async attemptSubmitExercise(exercise:Exercise) : Promise<Number> {
    const url : string = "http://localhost:3000/workout/createExercise";
    const body:Object = {
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "tags": exercise.tags,
      "duratime": exercise.duratime
    };
    return this.http.post(url, body).toPromise().then(data=>{
      return 200;
    }).catch(error=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  /** This function attempts to update an exercise by using the following parameters:
   * @author Luca Azmanov, u19004185
   * @param exercise represents an Exercise Object that will hold the necessary data for creating an exercise.
   * @param id the id corresponding to the exercise
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, User error and server error, respectively.
   */
  async attemptUpdateExercise(exercise:Exercise, id:string) : Promise<Number> {
    const url : string = "http://localhost:3000/workout/updateExercise";

    const body:Object = {
      "exercise":id,
      "title": exercise.title,
      "description": exercise.description,
      "repRange": exercise.repRange,
      "sets": exercise.sets,
      "Posedescription": exercise.Posedescription,
      "restPeriod": exercise.restPeriod,
      "tags": exercise.tags,
      "duratime": exercise.duratime
    };

    return this.http.put(url, body).toPromise().then(data=>{
      return 200;
    }).catch(error=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  /** This function attempts to submit an exercise by using the following parameters:
   * @author Luca Azmanov, u19004185
   * @param id the id corresponding to the exercise
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, User error and server error, respectively.
   */
  async attemptRemoveExercise(id:string) : Promise<Number> {
    const url : string = "http://localhost:3000/workout/deleteExercise";

    const body:Object = {
      "exercise":id,
    };

    return this.http.request('delete',url,{body}).toPromise().then(data=>{
      return 200;
    }).catch(error=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  /**
   * attempt to get all the workouts in the database for the library page
   * @author Jia Hui Wang, u18080449
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
   * @author Jia Hui Wang, u18080449
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

  /**
   * Attempt to obtain all workouts by the currently logged in Planner
   * @author Jia Hui Wang, u18080449
   */
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

  /**
   * Attempt to obtain all the exercises by the currently logged in Planner
   * @author Jia Hui Wang, u18080449
   */
  async attemptGetExercisesByPlanner() : Promise<any>{
    const url: string = "http://localhost:3000/workout/getExercisesByPlanner";

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

  async getTags() : Promise<any>{
    const url: string = "http://localhost:3000/workout/getTags";

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


/* Templates for new Back-end

  CreateWorkout:
  {
    "workoutTitle": "Tag me up Scotty",
    "workoutDescription": "This Super workout was designed to help promoting all dudes and dudettes getting fit. With 6 different exercises one can do when following this workout plan, you are bound to get shredded ",
    "tags": [
        {"label":"painful",
        "textColour":"BLUE",
        "backgroundColour":"RED",
        "selected": true},
        {"label":"painful",
        "textColour":"BLUE",
        "backgroundColour":"RED",
        "selected": true},
        {"label":"painful",
        "textColour":"BLUE",
        "backgroundColour":"RED",
        "selected": true}
    ]
  }

  UpdateWorkout:
  {
    "workoutID": "2c81fe46-ee34-45dd-b359-fcf9efc0dd5b",
    "workoutTitle": "Tag me up Scotty",
    "workoutDescription": "This Super workout was designed to help promoting all dudes and dudettes getting fit. With 6 different exercises one can do when following this workout plan, you are bound to get shredded ",
    "tags": [
        {"label":"Delightful",
        "textColour":"BLUE",
        "backgroundColour":"RED"},
        {"label":"ADD ONE",
        "textColour":"RED",
        "backgroundColour":"YELLOW"},
        {"label":"back",
        "textColour":"GREEN",
        "backgroundColour":"GREEN"}
    ]
  }

  Delete Workout:
  {
    "workoutID": "2c81fe46-ee34-45dd-b359-fcf9efc0dd5b"
  }

  CreateExercise:
  {
    "title": "Pull Up NO Tags",
    "description": "Pull up for your back, get that back dax! Get Those arms working! PULL UP BROOO",
    "repRange": "5 - 10 Reps",
    "sets": 2,
    "Posedescription": "Start off in holding the bar with arms straight then pull yourself up towards the bar slowly and once your chin is above the bar slowly decline to starting position",
    "restPeriod": 30,
    "tags": [
        {"label":"painful",
        "textColour":"BLUE",
        "backgroundColour":"BLUE"},
        {"label":"ADD ONE",
        "textColour":"RED",
        "backgroundColour":"RED"},
        {"label":"back",
        "textColour":"GREEN",
        "backgroundColour":"GREEN"}
    ],
    "duratime": 600
  }

  UpdateExercise:
  {
  "exercise": "46767253-79c5-4a3b-8229-2004eb21bad8",
  "title": "Pull Up NO Tags JUST VirginActive",
    "description": "Pull up for your back, get that back dax! Get Those arms working! PULL UP BROOO",
    "repRange": "5 - 10 Reps",
    "sets": 2,
    "Posedescription": "Start off in holding the bar with arms straight then pull yourself up towards the bar slowly and once your chin is above the bar slowly decline to starting position",
    "restPeriod": 30,
    "tags": [
        {"label":"painful",
        "textColour":"BLUE",
        "backgroundColour":"BLUE"},
        {"label":"ADD ONE",
        "textColour":"RED",
        "backgroundColour":"RED"},
        {"label":"back",
        "textColour":"GREEN",
        "backgroundColour":"GREEN"}
    ],
    "duratime": 600
  }


  Delete Exercise
  {
    "exercise": "46767253-79c5-4a3b-8229-2004eb21bad8"
  }
 */
