import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Workout} from "../Models/workout";
import {stat} from "fs";
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

  constructor(private http:HttpClient,
              private route:Router,
              private workoutService:WorkoutService,
              public alertController:AlertController,
              private alertGetter:Alerts) {
  }

  ngOnInit() {
  }

  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }

  async submitCreateRequest() {
    let new_workout = new Workout(this.title, this.description, this.diff);
    let status = await this.workoutService.attemptSubmitWorkout(new_workout);

    if (status < 400) {
      // Success State
      await this.presentAlert(this.alertGetter.WORKOUT_CREATED);
      this.route.navigate(['/your-workouts']).then(success=>{
        window.location.reload();}
      );
    }
    else if(status>=400 && status<500){
      // Invalid Input
      await this.presentAlert(this.alertGetter.CREATE_ERROR_WORKOUT);
    }
    else{
      // Server Error
      await this.presentAlert(this.alertGetter.SERVER_ERROR);
    }
  }
}
