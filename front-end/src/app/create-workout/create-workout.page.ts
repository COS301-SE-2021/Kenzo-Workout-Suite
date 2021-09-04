import {Component, OnInit, ViewChild} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController, IonSearchbar} from "@ionic/angular";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Workout} from "../Models/workout";

@Component({
    selector: "app-create-workout",
    templateUrl: "./create-workout.page.html",
    styleUrls: ["./create-workout.page.scss"],
})
export class CreateWorkoutPage implements OnInit {
  plannerID="";
  description="";
  title="";

  exercises = [];

  @ViewChild("searchBar", {static: false}) searchbar: IonSearchbar;

  constructor(private http: HttpClient,
              private route: Router,
              private workoutService: WorkoutService,
              public alertController: AlertController,) {
      this.getExercises();
  }

  ngOnInit() {
  }

  /**
   * This function retrieves the exercises for this planner
   *
   * @author Luca Azmanov, u19004185
   */
  async getExercises(){
      const data = await this.workoutService.attemptGetExercisesByPlanner();
      const exercises = data.data;
      // console.log(data.data);
      for (let i = 0; i <exercises.length; i++) {
          const exerciseID = exercises[i].exerciseID;
          const exerciseTitle = exercises[i].exerciseTitle;
          const images = exercises[i].images;
          this.exercises[i] = {id: exerciseID, title: exerciseTitle, images: images, selected: false};
      }
  }

  /** This function uses the workout service to submit a request to create a workout.
   * The workout service will return the status of the request:
   * 200 -> Success
   * 400 -> Incorrect Data
   * 500 -> Server not responding
   *
   * Thereafter,
   * Error states [400,500] will result in an alert
   * Success states [200] will result in a logged in a Planner being navigated to the logged in User's homescreen.
   *
   * @author Luca Azmanov, u19004185
   */
  async submitCreateRequest() {
      const newWorkout = new Workout(this.title, this.description, []);
      // console.log(this.format(this.exercises));
      // return ;
      const status = await this.workoutService.attemptSubmitWorkout(newWorkout, this.format(this.exercises));

      if (status < 400) {
      // Success State
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Workout Submitted",
              buttons: ["Go Back"]
          });

          await this.presentAlert(alert);
          this.route.navigate(["/your-workouts"]).then(()=>{
              this.reloadWindow();
          }
          );
          return 200;
      } else if(status>=400 && status<500){
      // Invalid Input
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Could not create workout",
              message: "Please fill all of the fields.",
              buttons: ["Dismiss"]
          });

          await this.presentAlert(alert);
          throw new Error("Data is invalid.");
      } else{
      // Server Error
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Server isn't responding",
              message: "Please try again later.",
              buttons: ["Dismiss"]
          });
          await this.presentAlert(alert);
          throw new Error("Server is not responding.");
      }
  }

  /**
   * Helper Function to physically present alert to User independent of OS.
   *
   * @param alert
   * @author Luca Azmanov, u19004185
   */
  async presentAlert(alert: any) {
      await alert.present();
      await alert.onDidDismiss();
  }

  reloadWindow(){
      window.location.reload();
  }

  format(data){
      const formattedExercises = [];

      for (let i = 0; i <data.length; i++) {
          if(data[i].selected) {
              formattedExercises.push({exerciseID: data[i].id});
          }
      }

      return formattedExercises;
  }

  select(id) {
      for (let i = 0; i < this.exercises.length; i++) {
          if(this.exercises[i].id === id){
              this.exercises[i].selected = !this.exercises[i].selected;
              return;
          }
      }
  }

  filterSelection(event) {
      const text = event.srcElement.value.trim().toLowerCase();
      for (let i = 0; i < this.exercises.length; i++) {
          const exercise = this.exercises[i];
          document.getElementById(exercise.id).style.display = "inline-block";
      }

      for (let i = 0; i < this.exercises.length; i++) {
          const exercise = this.exercises[i];
          if(!exercise.title.trim().toLowerCase().includes(text)){
              document.getElementById(exercise.id).style.display = "none";
          }
      }
  }

  showExercises() {
      const options = document.getElementById("exerciseDropdown");
      const expand = document.getElementById("expandExercises");
      const hide = document.getElementById("hideExercises");
      if(options.style.display === "block"){
          options.style.display = "none";
          hide.style.display = "none";
          expand.style.display = "inline-block";
      } else{
          options.style.display = "block";
          hide.style.display = "inline-block";
          expand.style.display = "none";
      }
  }

  showVideoOptions() {
      const options = document.getElementById("videoGen");
      const expand = document.getElementById("expandVideo");
      const hide = document.getElementById("hideVideo");
      if(options.style.display === "block"){
          options.style.display = "none";
          hide.style.display = "none";
          expand.style.display = "inline-block";
      } else{
          options.style.display = "block";
          hide.style.display = "inline-block";
          expand.style.display = "none";
      }
  }
}
