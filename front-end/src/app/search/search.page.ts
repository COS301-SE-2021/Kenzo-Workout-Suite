import { Component, OnInit } from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-search",
    templateUrl: "./search.page.html",
    styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  searchWorkouts: Observable<any>;
  searchExercises: Observable<any>;
  constructor(private http: HttpClient,
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
      const tempWorkouts = await this.workoutService.attemptGetWorkouts();
      if (tempWorkouts.status===200) {
          this.searchWorkouts = tempWorkouts.data;
          return 200;
      }else if (tempWorkouts.status===404){
          return 404;
      }else{
          return 500;
      }
  }

  /**
   * Load all the exercises
   */
  async loadExercises(){
      const tempExercises = await this.workoutService.attemptGetExercises();
      if (tempExercises.status===200){
          this.searchExercises = tempExercises.data;
          return 200;
      }else if (tempExercises.status===404){
          return 404;
      }else{
          return 500;
      }
  }

  /**
   * on keypress or enter key is pressed, filter the cards based on what is typed
   *
   * @param event
   */
  eventHandler(event) {
      const text = event.srcElement.value.toLowerCase();
      this.searchWorkouts.forEach(data => {
          const currElement = document.getElementById(data.workoutID);
          if (!(data.workoutTitle.toLowerCase().includes(text)) && !(data.workoutDescription.toLowerCase().includes(text))) {
              currElement.style.display = "none";
          } else {
              currElement.style.display = "block";
          }
      });
      this.searchExercises.forEach(data => {
          const currElement = document.getElementById(data.exercise);
          if (!(data.title.toLowerCase().includes(text)) && !(data.description.toLowerCase().includes(text))) {
              currElement.style.display = "none";
          } else {
              currElement.style.display = "block";
          }
      });
  }


  /**
   * Filter out the exercises and only show workouts
   */
  showWorkouts(){
      const exerciseBtn = document.getElementById("searchExerciseBtn");
      exerciseBtn.style.opacity = "0.5";
      const workoutBtn = document.getElementById("searchWorkoutBtn");
      workoutBtn.style.opacity = "1";
      document.getElementById("workoutScroll").style.display = "block";
      document.getElementById("exerciseScroll").style.display = "none";
  }

  /**
   * Filter out the workouts and only show exercises
   */
  showExercises(){
      const exerciseBtn = document.getElementById("searchExerciseBtn");
      exerciseBtn.style.opacity = "1";
      const workoutBtn = document.getElementById("searchWorkoutBtn");
      workoutBtn.style.opacity = "0.5";
      document.getElementById("workoutScroll").style.display = "none";
      document.getElementById("exerciseScroll").style.display = "block";
  }

  async goToFYP(){
      await this.router.navigate(["/your-workouts"])
          .then(() => {
              window.location.reload();
          });
  }

  async goToProfile(){
      await this.router.navigate(["/profile"])
          .then(() => {
              window.location.reload();
          });
  }

}
