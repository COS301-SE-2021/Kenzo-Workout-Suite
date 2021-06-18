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
  exercises: Observable<any>
  constructor(private http:HttpClient,
              private workoutService: WorkoutService) { }

  ngOnInit() {
    this.loadWorkouts();
    this.loadExercises();
  }


  /**
   * Load all the workouts
   *
   */
  async loadWorkouts(){
    let tempWorkouts = await this.workoutService.attemptGetWorkouts();
    if (tempWorkouts.status=200) {
      this.workouts = tempWorkouts.data;
      return 200;
    }
  }

  async loadExercises(){
    let tempExercises = await this.workoutService.attemptGetExercises();
    if (tempExercises.status==200){
      this.exercises = tempExercises.data;
      return 200;
    }
  }

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

}
