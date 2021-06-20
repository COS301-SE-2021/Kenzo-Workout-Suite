import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchWorkouts: Promise<any>;
  searchExercises: Promise<any>;
  constructor(private http:HttpClient,
              private workoutService: WorkoutService,
              private router: Router) { }

  ngOnInit() {
    this.loadWorkouts();
    this.loadExercises();
  }


  /**
   * Load all the workouts
   */
  async loadWorkouts(){
    let tempWorkouts = await this.workoutService.attemptGetWorkouts();
    if (tempWorkouts.status==200) {
      this.searchWorkouts = tempWorkouts.data;
      return 200;
    }else if (tempWorkouts.status==404){
      return 404;
    }else{
      return 500;
    }
  }

  /**
   * Load all the exercises
   */
  async loadExercises(){
    let tempExercises = await this.workoutService.attemptGetExercises();
    if (tempExercises.status==200){
      this.searchExercises = tempExercises.data;
      return 200;
    }else if (tempExercises.status==404){
      return 404;
    }else{
      return 500;
    }
  }

  /**
   * on keypress or enter key is pressed, filter the cards based on what is typed
   * @param event
   */
  eventHandler(event){
    let TypedValue = (<HTMLInputElement>document.getElementById("workout-searchbar")).value;
    this.searchWorkouts.then(result=>{
      result.forEach(data=>{
        if (!(data.workoutTitle.includes(TypedValue)) && !(data.workoutDescription.includes(TypedValue))){
          document.getElementById(data.workoutID).style.display = "none";
        }
        else{
          document.getElementById(data.workoutID).style.display = "block";
        }
      })

    })

    this.searchExercises.then(result=>{
      result.forEach(data=>{
        if (!(data.title.includes(TypedValue)) && !(data.description.includes(TypedValue))){
          document.getElementById(data.exercise).style.display = "none";
        }
        else{
          document.getElementById(data.exercise).style.display = "block";
        }
      })
    })
  }

  /**
   * Filter out the exercises and only show workouts
   */
  showWorkouts(){
    let exerciseBtn = document.getElementById("searchExerciseBtn");
    exerciseBtn.style.opacity = "0.5";
    let workoutBtn = document.getElementById("searchWorkoutBtn");
    workoutBtn.style.opacity = "1";
    document.getElementById("workoutScroll").style.display = "block";
    document.getElementById("exerciseScroll").style.display = "none";
  }

  /**
   * Filter out the workouts and only show exercises
   */
  showExercises(){
    let exerciseBtn = document.getElementById("searchExerciseBtn");
    exerciseBtn.style.opacity = "1";
    let workoutBtn = document.getElementById("searchWorkoutBtn");
    workoutBtn.style.opacity = "0.5";
    document.getElementById("workoutScroll").style.display = "none";
    document.getElementById("exerciseScroll").style.display = "block";
  }

  async goToFYP(){
    await this.router.navigate(['/your-workouts'])
      .then(() => {
        window.location.reload();
      });
  }

}
