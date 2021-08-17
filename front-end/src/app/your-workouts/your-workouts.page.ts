import { Component, OnInit } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {ActionSheetController, AlertController} from "@ionic/angular";
import { Router } from "@angular/router";
import {Exercise} from "../Models/exercise";
import {ClientService} from "../Services/ClientService/client.service";

class Workouts{
  private _workoutID: string;
  private _title: string;
  private _description: string;
  private _exercises: Exercise[];
  private _images: string[];

  get images(): string[] {
      return this._images;
  }

  set images(value: string[]) {
      this._images = value;
  }

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

  constructor(workoutID: string, title: string, description: string, exercises: Exercise[], images: string[]) {
      this._workoutID = workoutID;
      this._title = title;
      this._description = description;
      this._exercises = exercises;
      this._images = images;
  }
}
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
    selector: "app-your-workouts",
    templateUrl: "./your-workouts.page.html",
    styleUrls: ["./your-workouts.page.scss"],
})
export class YourWorkoutsPage implements OnInit {
  workouts: Workouts[] = new Array();
  exercises: Exercises[] = new Array();

  pdf: any;
  constructor(private http: HttpClient,
              private workoutService: WorkoutService,
              private clientService: ClientService,
              public alertController: AlertController,
              private router: Router,
              public actionSheetController: ActionSheetController) { }

  ngOnInit() {
      this.loadExercises();
  }

  /**
   * Load all the workouts by calling the workoutService function and then return data accordingly based on status code
   */
  async loadWorkouts(){
      const tempWorkouts = await this.workoutService.attemptGetWorkoutsByPlanner();
      if (tempWorkouts.status===200){
          let images = new Array();
          for (let i = 0; i < tempWorkouts.data.length; i++) {
              for (let j = 0; j <this.exercises.length; j++) {
                  if(this.exercises[j].exerciseID===tempWorkouts.data[i].exercises[0].exerciseID){
                      for (let k = 0; k < this.exercises[j].images.length; k++) {
                          if(this.exercises[j].images[k]!==null) {
                              images.push(this.exercises[j].images[k]);
                              continue;
                          }
                      }
                  }
              }
              this.workouts[i] = new Workouts(tempWorkouts.data[i].workoutID, tempWorkouts.data[i].workoutTitle, tempWorkouts.data[i].workoutDescription, tempWorkouts.data[i].exercises, images);
              images = [];
          }

          return 200;
      }else if (tempWorkouts.status===404){
          return 404;
      }else{
          return 500;
      }
  }

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
          await this.loadWorkouts();
          return 200;
      }else if (tempExercises.status===404){
          return 404;
      }else{
          return 500;
      }
  }


  async sendWorkoutID(id: string){
      await this.router.navigate(["/update-workout"], {
          state:{
              id: id
          }
      });
  }

  async sharePDF(id: string){
      this.pdf = await this.workoutService.attemptGetPDF(id);
      if (this.pdf.status===200){
          const potato = this.presentActionSheet(this.pdf.data, id);
          console.log(potato);
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
          const currElement = document.getElementById(data.workoutID);
          if (!(data.title.toLowerCase().includes(text)) && !(data.description.toLowerCase().includes(text))) {
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

  async presentActionSheet(pdf: string, workoutID: string) {
      const actionSheet = await this.actionSheetController.create({
          header: "Share PDF",
          cssClass: "actionOptions",
          buttons: [{
              text: "Email PDF to all clients",
              role: "selected",
              icon: "mail-outline",
              handler: () => {
                  this.clientService.attemptEmailAllClientsPDF(workoutID);
                  console.log("PDFs sent");
              }
          }, {
              text: "Email video to all clients",
              role: "selected",
              icon: "videocam-outline",
              handler: () => {
                  this.clientService.attemptEmailAllClientsVideo(workoutID);
                  console.log("Videos sent");
              }
          }, {
              text: "Email PDF and video to all clients",
              role: "selected",
              icon: "documents-sharp",
              handler: () => {
                  this.clientService.attemptEmailAllClientsMedia(workoutID);
                  console.log("Multimedia sent");
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
      const {data} = await actionSheet.onDidDismiss();
      return data;
  }
}
