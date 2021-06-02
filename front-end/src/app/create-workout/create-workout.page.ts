import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";

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
              public alertController:AlertController) {
  }

  ngOnInit() {
  }

  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }

  submitCreateRequest() {
    const url : string = "http://localhost:5500/workout/createWorkout";

    const body:Object = {
      "workoutTitle": this.title,
      "workoutDescription": this.description,
      "difficulty": this.diff
    };

    this.http.post(url, body).subscribe(async data =>{
      // Success State
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Workout Submitted',
        buttons: ['Go Back']
      });
      await this.presentAlert(alert);
      this.route.navigate(['/your-workouts']);
    }, async error => {
        // Invalid Sign In
        const alert = await this.alertController.create({
          cssClass: 'kenzo-alert',
          header: 'Could not create workout',
          message: 'Please fill all of the fields.',
          buttons: ['Dismiss']
        });
        this.presentAlert(alert);
    });
  }
}
