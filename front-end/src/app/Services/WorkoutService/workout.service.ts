import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Workout} from "../../Models/workout";
import {Exercise} from "../../Models/exercise";
import {UserService} from "../UserService/user.service";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class WorkoutService {

  private apiURL = environment.apiURL;

  constructor(private http: HttpClient,
              private user: UserService) {
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
  async attemptSubmitWorkout(workout: Workout, exercises, loop, genre, width, height): Promise<number> {
      const url = this.apiURL+"/workout/createWorkout";

      const body = {
          workoutTitle: workout.title,
          workoutDescription: workout.description,
          exercises:exercises,
          loop: loop,
          songChoice: genre,
          resolutionWidth: width,
          resolutionHeight: height
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
  async attemptUpdateWorkout(workout: Workout, id: string, exercises, loop, genre, width, height): Promise<number> {
      const url = this.apiURL+"/workout/updateWorkout";

      const body = {
          workoutID:id,
          workoutTitle: workout.title,
          workoutDescription: workout.description,
          exercises:exercises,
          loop: loop,
          songChoice: genre,
          resolutionWidth: width,
          resolutionHeight: height
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
      const url = this.apiURL+"/workout/deleteWorkout";
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
      const url = this.apiURL+"/workout/createExercise";
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
      const url = this.apiURL+"/workout/updateExercise";

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
      const url = this.apiURL+"/workout/deleteExercise";

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
   * This function attempts to obtain all the workouts in the database from the endpoint provided.
   *
   * @returns 200,400,500 represent a success, User error and server error, respectively.
   * @author Jia Hui Wang, u18080449
   */
  async attemptGetWorkouts(): Promise<any>{
      const url = this.apiURL+"/workout/getWorkouts";
      return this.http.get(url).toPromise().then(data=>{
          data = {
              status: 200,
              data: data
          };
          return data;
      }).catch(err=>err);
  }

  /**
   * This function attempts to obtain all the exercises in the database from the endpoint provided.
   *
   * @returns 200,404,500 represent a success, not found error and server error, respectively.
   * @author Jia Hui Wang, u18080449
   */
  async attemptGetExercises(): Promise<any>{
      const url = this.apiURL+"/workout/getExercises";
      return this.http.get(url).toPromise().then(data=>{
          data = {
              status: 200,
              data: data
          };
          return data;
      }).catch(err=>err);
  }

  /**
   * This function attempts to obtain all the workouts in the database for a specific planner from the endpoint provided.
   *
   * @returns 200,404,500 represent a success, not found error and server error, respectively.
   * @author Jia Hui Wang, u18080449
   */
  async attemptGetWorkoutsByPlanner(): Promise<any>{
      const url = this.apiURL+"/workout/getWorkoutByPlanner";

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

  /**
   * This function attempts to obtain all the exercises in the database for a specific planner from the endpoint provided.
   *
   * @returns 200,404,500 represent a success, not found error and server error, respectively.
   * @author Jia Hui Wang, u18080449
   */
  async attemptGetExercisesByPlanner(): Promise<any>{
      const url = this.apiURL+"/workout/getExercisesByPlanner";

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

  /**
   * This function attempts to obtain the PDF of a specific workout based on the ID passed in from the endpoint provided.
   *
   * @param id unique ID of the workout
   * @returns 200,404,500 represent a success, not found error and server error, respectively.
   * @author Jia Hui Wang, u18080449
   */
  async attemptGetPDF(id: string): Promise<any>{
      const url = this.apiURL+"/workout/getWorkoutPDF/"+id;
      return await this.http.get(url).toPromise().then(data=>{
          data = {
              status: 200,
              data: data
          };
          return data;
      }).catch(error=>{
          if(error.status >=200 && error.status<300){
              error = {
                  status: 200,
                  data: error.error.text
              };
              return error;
          } else if(error.status===0 || error.status === 500) {
              return 500;
          }else {
              return 404;
          }
      });
  }

  /**
   * This function attempts to obtain the video of a specific workout based on the ID passed in from the endpoint provided.
   *
   * @param id unique ID of the workout
   * @returns 200,404,500 represent a success, not found error and server error, respectively.
   * @author Jia Hui Wang, u18080449
   */
  async attemptGetVideo(id: string): Promise<any>{
      const url = this.apiURL+"/workout/getWorkoutVideo/"+id;
      return await this.http.get(url).toPromise().then(data=>{
          data = {
              status: 200,
              data: data
          };
          return data;
      }).catch(error=>{
          if(error.status >=200 && error.status<300){
              error = {
                  status: 200,
                  data: error.error.text
              };
              return error;
          } else if(error.status===0 || error.status === 500) {
              return 500;
          }else if(error.status===400) {
              return 400;
          }else {
              return 404;
          }
      });
  }

  async getTags(): Promise<any>{
      const url = this.apiURL+"/workout/getTags";

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
