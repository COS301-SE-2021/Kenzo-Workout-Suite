import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Workout} from "../Models/workout";

@Component({
  selector: 'app-your-workouts',
  templateUrl: './your-workouts.page.html',
  styleUrls: ['./your-workouts.page.scss'],
})
export class YourWorkoutsPage implements OnInit {
  workouts: Promise<any>;
  constructor(private http:HttpClient,
              private workoutService:WorkoutService) { }

  ngOnInit() {
    this.LoadWorkouts();
  }

  async LoadWorkouts(){
    this.workouts = this.workoutService.attemptGetWorkouts();
    this.workouts.then(x=>{
      this.workouts = x["data"];
    })
  }

}
