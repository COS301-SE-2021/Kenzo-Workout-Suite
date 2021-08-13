import { Component, OnInit } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {AlertController} from "@ionic/angular";
import { Router } from "@angular/router";
import {Observable} from "rxjs";

@Component({
    selector: "app-your-workouts",
    templateUrl: "./your-workouts.page.html",
    styleUrls: ["./your-workouts.page.scss"],
})
export class YourWorkoutsPage implements OnInit {
  workouts: Observable<any>;
  constructor(private http: HttpClient,
              private workoutService: WorkoutService,
              public alertController: AlertController,
              private router: Router) { }

  ngOnInit() {
      this.loadWorkouts();
  }

  /**
   * Load all the workouts by calling the workoutService function and then return data accordingly based on status code
   */
  async loadWorkouts(){
      const tempWorkouts = await this.workoutService.attemptGetWorkoutsByPlanner();
      if (tempWorkouts.status===200){
          this.workouts = tempWorkouts.data;
          return 200;
      }else if (tempWorkouts.status===404){
          return 404;
      }else{
          return 500;
      }
  }

  async presentAlert(alert: any) {
      await alert.present();
      await alert.onDidDismiss();
  }

  async sendWorkoutID(id: string){
      console.log(id);
      await this.router.navigate(["/update-workout"], {
          state:{
              id: id
          }
      });
  }

  async sharePDF(id: string){
      const PDF = await this.workoutService.attemptGetPDF(id);
      console.log(PDF);
  }

  async goToSearch(){
      await this.router.navigate(["/search"])
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

  eventHandler(event) {
      const text = event.srcElement.value.toLowerCase();
      this.workouts.forEach(data => {
          const currElement = document.getElementById(data.workoutID);
          if (!(data.workoutTitle.toLowerCase().includes(text)) && !(data.workoutDescription.toLowerCase().includes(text))) {
              currElement.style.display = "none";
          } else {
              currElement.style.display = "block";
          }
      });
  }

}
