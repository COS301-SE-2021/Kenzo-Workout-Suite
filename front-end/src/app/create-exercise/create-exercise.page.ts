import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Exercise} from "../Models/exercise";

@Component({
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.page.html',
  styleUrls: ['./create-exercise.page.scss'],
})
export class CreateExercisePage implements OnInit {
  title: string;
  description: string;
  diff: string;
  range: string;
  sets: number;
  pose_description: string;
  rest: number;
  duration: number;

  constructor(private http:HttpClient,
              private route:Router,
              public alertController:AlertController,
              private workoutService:WorkoutService) { }

  ngOnInit() {
  }

  /** This function uses the workout service to submit a request to create an exercise.
   * The workout service will return the status of the request:
   * 200 -> Success
   * 400 -> Incorrect Data
   * 500 -> Server not responding
   *
   * Thereafter,
   * Error states [400,500] will result in an alert
   * Success states [200] will result in a logged in a Planner being navigated to the logged in User's homescreen.
   */
  async createExercise() {
    let exercise = new Exercise(this.title, this.description, this.range, this.sets, this.pose_description,
      this.rest, this.diff, this.duration);
    let status = await this.workoutService.attemptSubmitExercise(exercise);

    if (status < 400) {
      // Success State
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Workout Submitted',
        buttons: ['Go Back']
      });

      await this.presentAlert(alert);
      this.route.navigate(['/your-workouts']).then(success=>{
        window.location.reload();}
      );
    }
    else if(status>=400 && status<500){
      // Invalid Input
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Could not create workout',
        message: 'Please fill all of the fields.',
        buttons: ['Dismiss']
      });

      await this.presentAlert(alert);
    }
    else{
      // Server Error
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: "Server isn't responding",
        message: 'Please try again later.',
        buttons: ['Dismiss']
      });
      await this.presentAlert(alert);
    }
  }

  /**
   * Helper Function to physically present alert to user independent of OS.
   * @param alert
   */
  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }
}
