import {Component, OnInit, ViewChild} from '@angular/core';
import {KenzoTag} from "../Models/kenzo-tag";
import {AlertController, IonSearchbar} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Workout} from "../Models/workout";

@Component({
  selector: 'app-update-workout',
  templateUrl: './update-workout.page.html',
  styleUrls: ['./update-workout.page.scss'],
})
export class UpdateWorkoutPage implements OnInit {
  description: string="";
  title: string="";

  @ViewChild('searchBar', {static: false}) searchbar: IonSearchbar;
  id:string;

  constructor(private http:HttpClient,
              private route:Router,
              private workoutService:WorkoutService,
              public alertController:AlertController,) {
    this.id = route.getCurrentNavigation().extras.state.id;
  }

  ngOnInit() {
    this.getDetails();
  }

  async getDetails(){
    let workout = await this.workoutService.attemptGetWorkouts();
    let data = workout['data'];
    let unit;
    for (let i = 0; i < data.length; i++) {
      unit = data[i];

      if(unit['workoutID']==this.id){
        break;
      }
    }
    this.title = unit['workoutTitle'];
    this.description = unit['workoutDescription'];
  }

  /** This function uses the workout service to submit a request to update a workout.
   * The workout service will return the status of the request:
   * 200 -> Success
   * 400 -> Incorrect Data
   * 500 -> Server not responding
   *
   * Thereafter,
   * Error states [400,500] will result in an alert
   * Success states [200] will result in a logged in a Planner being navigated to the logged in User's homescreen.
   * @author Luca Azmanov, u19004185
   */
  async submitUpdateRequest() {
    let new_workout = new Workout(this.title, this.description, []);
    let status = await this.workoutService.attemptUpdateWorkout(new_workout, this.id);

    if (status < 400) {
      // Success State
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Workout Updated',
        buttons: ['Go Back']
      });

      await this.presentAlert(alert);
      this.route.navigate(['/your-workouts']).then(success=>{
        this.reloadWindow();}
      );
      return 200;
    }
    else if(status>=400 && status<500){
      // Invalid Input
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Could not update workout',
        message: 'Please fill all of the fields.',
        buttons: ['Dismiss']
      });

      await this.presentAlert(alert);
      throw new Error("Data is invalid.");
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
      throw new Error("Server is not responding.");
    }
  }

  /** This function uses the workout service to submit a request to delete a workout.
   * The workout service will return the status of the request:
   * 200 -> Success
   * 400 -> Error
   * 500 -> Server not responding
   *
   * Thereafter,
   * Error states [400,500] will result in an alert
   * Success states [200] will result in a logged in a Planner being navigated to the logged in User's homescreen.
   * @author Luca Azmanov, u19004185
   */
  async submitDeleteRequest() {
    let confirmation = false;
    const alert = await this.alertController.create({
      cssClass: 'kenzo-alert',
      header: 'Are you sure you would like to delete this workout?',
      buttons: [{text:'Delete',
        handler: (confirm)=>{
          confirmation = true;
        }},'Cancel']
    });

    await this.presentAlert(alert);
    if(!confirmation) return;

    let status = await this.workoutService.attemptRemoveWorkout(this.id);

    if (status < 400) {
      // Success State
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Workout Deleted',
        buttons: ['Go Back']
      });

      await this.presentAlert(alert);
      this.route.navigate(['/your-workouts']).then(success=>{
        this.reloadWindow();}
      );
      return 200;
    }
    else if(status>=400 && status<500){
      // Invalid Input
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Could not delete workout',
        message: 'Please try again later.',
        buttons: ['Dismiss']
      });

      await this.presentAlert(alert);
      throw new Error("Data is invalid.");
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
      throw new Error("Server is not responding.");
    }
  }

  /**
   * Helper Function to physically present alert to User independent of OS.
   * @param alert
   * @author Luca Azmanov, u19004185
   */
  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }

  reloadWindow(){
    window.location.reload();
  }
}
