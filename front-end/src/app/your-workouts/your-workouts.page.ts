import { Component, OnInit } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {ActionSheetController, AlertController} from "@ionic/angular";
import { Router } from "@angular/router";
import {Exercise} from "../Models/exercise";

class Workouts{
  private _workoutID: string;
  private _title: string;
  private _description: string;
  private _exercises: Exercise[];

  get workoutID(): string {
      return this._workoutID;
  }

  set workoutID(value: string) {
      this._workoutID = value;
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

  get exercises(): Exercise[] {
      return this._exercises;
  }

  set exercises(value: Exercise[]) {
      this._exercises = value;
  }

  constructor(workoutID: string, title: string, description: string, exercises: Exercise[]) {
      this._workoutID = workoutID;
      this._title = title;
      this._description = description;
      this._exercises = exercises;
  }
}

@Component({
    selector: "app-your-workouts",
    templateUrl: "./your-workouts.page.html",
    styleUrls: ["./your-workouts.page.scss"],
})
export class YourWorkoutsPage implements OnInit {
  workouts: Workouts[] = new Array();
  pdf: any;
  constructor(private http: HttpClient,
              private workoutService: WorkoutService,
              public alertController: AlertController,
              private router: Router,
              public actionSheetController: ActionSheetController) { }

  ngOnInit() {
      this.loadWorkouts();
  }

  /**
   * Load all the workouts by calling the workoutService function and then return data accordingly based on status code
   */
  async loadWorkouts(){
      const tempWorkouts = await this.workoutService.attemptGetWorkoutsByPlanner();
      if (tempWorkouts.status===200){
          for (let i = 0; i < tempWorkouts.data.length; i++) {
              this.workouts[i] = new Workouts(tempWorkouts.data[i].workoutID, tempWorkouts.data[i].workoutTitle, tempWorkouts.data[i].workoutDescription, tempWorkouts.data[i].exercises);
          }
          console.log(this.workouts);
          return 200;
      }else if (tempWorkouts.status===404){
          return 404;
      }else{
          return 500;
      }
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
      this.pdf = await this.workoutService.attemptGetPDF(id);
      if (this.pdf.status===200){
          this.presentActionSheet(this.pdf.data);
          return 200;
      }else if (this.pdf.status===404){
          return 404;
      }else{
          return 500;
      }
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
          const currElement = document.getElementById(data["workoutID"]);
          if (!(data["workoutTitle"].toLowerCase().includes(text)) && !(data["workoutDescription"].toLowerCase().includes(text))) {
              currElement.style.display = "none";
          } else {
              currElement.style.display = "block";
          }
      });
  }

  async presentAlert(alert: any) {
      await alert.present();
      await alert.onDidDismiss();
  }

  async presentActionSheet(pdf: string) {
      const actionSheet = await this.actionSheetController.create({
          header: "Share PDF",
          cssClass: "my-custom-class",
          buttons: [{
              text: "Email PDF",
              role: "selected",
              icon: "mail-outline",
              handler: () => {
                  console.log("Email clicked");
              }
          }, {
              text: "Download PDF",
              role: "selected",
              icon: "download-outline",
              handler: () => {
                  const source = pdf;
                  const link = document.createElement("a");
                  link.href = source;
                  link.download = "workout.pdf";
                  link.click();
              }
          }, {
              text: "Cancel",
              icon: "close",
              role: "cancel",
              handler: () => {
                  console.log("Cancel clicked");
              }
          }]
      });
      await actionSheet.present();
      const {role} = await actionSheet.onDidDismiss();
      return role;
  }
}
