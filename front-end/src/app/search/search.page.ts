import { Component, OnInit } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import { Router } from "@angular/router";

class Exercises{
  private _exerciseID: string;
  private _title: string;
  private _description: string;

  get exerciseID(): string {
      return this._exerciseID;
  }

  set exerciseID(value: string) {
      this._exerciseID = value;
  }

  get title(): string {
      return this._title;
  }

  set title(value: string) {
      this._title = value;
  }

  get description(): string {
      return this._description;
  }

  set description(value: string) {
      this._description = value;
  }

  constructor(exerciseID: string, title: string, description: string) {
      this._exerciseID = exerciseID;
      this._title = title;
      this._description = description;
  }
}

@Component({
    selector: "app-search",
    templateUrl: "./search.page.html",
    styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  exercises: Exercises[] = new Array();
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
          for (let i = 0; i < tempExercises.data.length; i++) {
              this.exercises[i] = new Exercises(tempExercises.data[i].exerciseID, tempExercises.data[i].exerciseTitle, tempExercises.data[i].exerciseDescription);
          }
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
      this.exercises.forEach(data => {
          const currElement = document.getElementById(data.exerciseID);
          if (!(data.title.toLowerCase().includes(text)) && !(data.description.toLowerCase().includes(text))) {
              currElement.style.display = "none";
          } else {
              currElement.style.display = "block";
          }
      });
  }

  async sendExerciseID(id: string){
      await this.router.navigate(["/update-exercise"], {
          state:{
              id: id
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
