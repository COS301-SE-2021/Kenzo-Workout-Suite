import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Workout} from "../Models/workout";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-your-workouts',
  templateUrl: './your-workouts.page.html',
  styleUrls: ['./your-workouts.page.scss'],
})
export class YourWorkoutsPage implements OnInit {
  workouts : Promise<any>
  constructor(private http:HttpClient,
              private workoutService:WorkoutService,
              public alertController:AlertController) { }

  ngOnInit() {
    this.LoadWorkouts();
  }

  async LoadWorkouts(){
    let tempWorkouts = await this.workoutService.attemptGetWorkouts();
      if (tempWorkouts.status=200){
        this.workouts = tempWorkouts.data;
        return 200;
      }else if (tempWorkouts.status==404){
        const alert = await this.alertController.create({
          cssClass: 'kenzo-alert',
          header: '404 Not Found',
          message: 'No workouts found in the database',
          buttons: ['Go Back']
        });
        await this.presentAlert(alert);
        return 404;
      }else{
        const alert = await this.alertController.create({
          cssClass: 'kenzo-alert',
          header: '500 Server Error',
          message: 'Server not responding.',
          buttons: ['Go Back']
        });
        await this.presentAlert(alert);
        throw new Error("Server is not responding.");
        return 500;
      }
  }

  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }

}
