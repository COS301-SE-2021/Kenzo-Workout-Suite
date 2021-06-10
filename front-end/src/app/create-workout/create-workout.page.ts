import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Workout} from "../Models/workout";
import {Alerts} from "../Models/alerts";

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.page.html',
  styleUrls: ['./create-workout.page.scss'],
})
export class CreateWorkoutPage implements OnInit {
  diff: string="";
  description: string="";
  title: string="";

  alertGetter:any;

  constructor(private http:HttpClient,
              private route:Router,
              private workoutService:WorkoutService,
              public alertController:AlertController,) {
    // this.alertGetter = new Alerts(alertController);
  }

  ngOnInit() {
  }

  async submitCreateRequest() {
    let new_workout = new Workout(this.title, this.description, this.diff);
    let status = await this.workoutService.attemptSubmitWorkout(new_workout);

    if (status < 400) {
      // Success State
      //await this.presentAlert(this.alertGetter.WORKOUT_CREATED);
      this.route.navigate(['/your-workouts']).then(success=>{
        window.location.reload();}
      );
    }
    else if(status>=400 && status<500){
      // Invalid Input
      // await this.presentAlert(this.alertGetter.CREATE_ERROR_WORKOUT);
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
      // await this.presentAlert(this.alertGetter.SERVER_ERROR);
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
