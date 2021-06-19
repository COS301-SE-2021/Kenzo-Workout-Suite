import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Workout} from "../Models/workout";
import {AlertController} from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: 'app-your-workouts',
  templateUrl: './your-workouts.page.html',
  styleUrls: ['./your-workouts.page.scss'],
})
export class YourWorkoutsPage implements OnInit {
  workouts : Promise<any>;
  exercises: Promise<any>;
  constructor(private http:HttpClient,
              private workoutService:WorkoutService,
              public alertController:AlertController,
              private router: Router) { }

  ngOnInit() {
    this.loadWorkouts();
    this.loadExercises();
  }

  /**
   * Load all the workouts by calling the workoutService function and then return data accordingly based on status code
   */
  async loadWorkouts(){
    let tempWorkouts = await this.workoutService.attemptGetWorkoutsByPlanner();
      if (tempWorkouts.status==200){
        this.workouts = tempWorkouts.data;
        return 200;
      }else if (tempWorkouts.status==404){
        return 404;
      }else{
        throw new Error("Server is not responding.");
        return 500;
      }
  }

  async loadExercises(){
    let tempExercises = await this.workoutService.attemptGetExercisesByPlanner();
    if (tempExercises.status==200){
      this.workouts = tempExercises.data;
      return 200;
    }else if (tempExercises.status==404){
      return 404;
    }else{
      throw new Error("Server is not responding.");
      return 500;
    }
  }

  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }

  /**
   * Filter out the exercises and only show workouts
   */
  showWorkouts(){
    let exerciseBtn = document.getElementById("exerciseBtn");
    exerciseBtn.style.opacity = "0.5";
    let workoutBtn = document.getElementById("workoutBtn");
    workoutBtn.style.opacity = "1";
    document.getElementById("workoutScroll").style.display = "block";
    document.getElementById("exerciseScroll").style.display = "none";
  }

  /**
   * Filter out the workouts and only show exercises
   */
  showExercises(){
    let exerciseBtn = document.getElementById("exerciseBtn");
    exerciseBtn.style.opacity = "1";
    let workoutBtn = document.getElementById("workoutBtn");
    workoutBtn.style.opacity = "0.5";
    document.getElementById("workoutScroll").style.display = "none";
    document.getElementById("exerciseScroll").style.display = "block";
  }

  async sendWorkoutID(id: string){
    await this.router.navigate(['/update-workout'],{
      state:{
        id: id
      }
    })
  }

  async sendExerciseID(id: string){
    await this.router.navigate(['/update-exercise']),{
      state:{
        id: id
      }
    }
  }

}
