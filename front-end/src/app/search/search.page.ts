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
  searchExercises: Observable<any>;
  constructor(private http: HttpClient,
              private workoutService: WorkoutService,
              private router: Router) { }

  ngOnInit() {
      this.loadExercises();
  }

  /**
   * Load all the exercises
   */
  async loadExercises(){
      const tempExercises = await this.workoutService.attemptGetExercises();
      if (tempExercises.status===200){
          this.searchExercises = tempExercises.data;
          console.log(this.searchExercises);
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
      this.searchExercises.forEach(data => {
          const currElement = document.getElementById(data.exercise);
          if (!(data.title.toLowerCase().includes(text)) && !(data.description.toLowerCase().includes(text))) {
              currElement.style.display = "none";
          } else {
              currElement.style.display = "block";
          }
      });
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

  async goToClients(){
      await this.router.navigate(["/client-list"])
          .then(() => {
              window.location.reload();
          });
  }

}
