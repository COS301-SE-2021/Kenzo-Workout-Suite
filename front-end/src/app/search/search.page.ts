import { Component, OnInit } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import { Router } from "@angular/router";

/**
 * Exercise class to store the information obtained from requests in member array exercises to dynamically populate cards
 *
 * @author Jia Hui Wang, u18080449
 */
class Exercises{
  private _exerciseID: string;
  private _title: string;
  private _description: string;
  private _images: string[];


  get images(): string[] {
      return this._images;
  }

  set images(value: string[]) {
      this._images = value;
  }

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

  constructor(exerciseID: string, title: string, description: string, images: string[]) {
      this._exerciseID = exerciseID;
      this._title = title;
      this._description = description;
      this._images = images;
  }
}

@Component({
    selector: "app-search",
    templateUrl: "./search.page.html",
    styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
  exercises: Exercises[] = new Array();
  exerciseThumbnails = new Array();

  src="";

  constructor(private http: HttpClient,
              private workoutService: WorkoutService,
              private router: Router) { }

  ngOnInit() {
      this.loadExercises();
  }

  /**
   * Load all the exercises
   * @author Jia Hui Wang, u18080449
   */
  async loadExercises(){
      const tempExercises = await this.workoutService.attemptGetExercises();
      if (tempExercises.status===200){
          for (let i = 0; i < tempExercises.data.length; i++) {
              const images = new Array();
              for (let j = 0; j < tempExercises.data[i].images.length; j++) {
                  if(tempExercises.data[i].images[j]!=null){
                      if(!(tempExercises.data[i].images[j]).includes("data:image/jpeg;base64,")){
                          tempExercises.data[i].images[j] = "data:image/jpeg;base64,"+tempExercises.data[i].images[j];
                      }
                      images.push(tempExercises.data[i].images[j]);
                  }
              }
              this.exercises[i] = new Exercises(tempExercises.data[i].exerciseID, tempExercises.data[i].exerciseTitle, tempExercises.data[i].exerciseDescription, images);
          }
          return 200;
      }else if (tempExercises.status===404){
          return 404;
      }else{
          return 500;
      }
  }

  /**
   * eventHandler for the search functionality on the page to filter for specific cards based on the text
   *
   * @param event The onChange when user enters or removes characters to filter the cards
   * @author Jia Hui Wang, u18080449
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

  /**
   * Navigate to the update-exercise page with the respective ID of the selected exercise in order to update the workout.
   *
   * @author Jia Hui Wang, u18080449
   */
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
