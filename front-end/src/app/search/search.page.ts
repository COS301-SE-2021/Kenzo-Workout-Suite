import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {WorkoutService} from "../Services/WorkoutService/workout.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  workouts: Observable<any>;
  exercises: Observable<any>;
  constructor(private http:HttpClient,
              private workoutService: WorkoutService) { }

  ngOnInit() {
    this.loadWorkouts();
    this.loadExercises();
  }


  /**
   * Load all the workouts
   */
  async loadWorkouts(){
    let tempWorkouts = await this.workoutService.attemptGetWorkouts();
    if (tempWorkouts.status=200) {
      this.workouts = tempWorkouts.data;
      return 200;
    }
    tempWorkouts.length;
  }

  /**
   * Load all the exercises
   */
  async loadExercises(){
    let tempExercises = await this.workoutService.attemptGetExercises();
    if (tempExercises.status==200){
      this.exercises = tempExercises.data;
      return 200;
    }
  }

  /**
   * on keypress or enter key is pressed, filter the cards based on what is typed
   * @param event
   */
  eventHandler(event){
    let TypedValue = (<HTMLInputElement>document.getElementById("workout-searchbar")).value;
    this.workouts.forEach(x=>{
      if (!(x.workoutTitle.includes(TypedValue)) && !(x.workoutDescription.includes(TypedValue))){
        document.getElementById(x.workoutID).style.display = "none";
      }
      else{
        document.getElementById(x.workoutID).style.display = "block";
      }
    })

    this.exercises.forEach(x=>{
      if (!(x.title.includes(TypedValue)) && !(x.description.includes(TypedValue))){
        document.getElementById(x.exercise).style.display = "none";
      }
      else{
        document.getElementById(x.exercise).style.display = "block";
      }
    })
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

}
