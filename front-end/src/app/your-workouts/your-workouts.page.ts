import { Component, OnInit } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {ActionSheetController, AlertController} from "@ionic/angular";
import { Router } from "@angular/router";
import {Exercise} from "../Models/exercise";
import {ClientService} from "../Services/ClientService/client.service";

/**
 * Workouts class to store the information obtained from requests in member array workouts to dynamically populate cards
 *
 * @author Jia Hui Wang, u18080449
 */
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

/**
 * Exercise class to store the information obtained from requests in member array exercises to dynamically populate cards
 *
 * @author Jia Hui Wang, u18080449
 */
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
   *
   * @author Jia Hui Wang, u18080449
   */
  creat;
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

  /**
   * Load all the exercises and then filter to find the respective exercises for each workout to display the preview images
   *
   * @author Luca Azmanov, u19004185
   */
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

  /**
   * Attempt to obtain the PDF of the workout and based on the status, either present an Action Sheet for the user to choose from multiple options then
   * return a code or just return a code.
   *
   * @param id The id of the workout of which the pdf is to obtained for.
   * @author Jia Hui Wang, u18080449
   */
  async sharePDF(id: string){
      this.pdf = await this.workoutService.attemptGetPDF(id);
      if (this.pdf.status===200){
          this.presentActionSheet(this.pdf.data, id);
          return 200;
      }else if (this.pdf.status===404){
          return 404;
      }else{
          return 500;
      }
  }

  /**
   * Navigate to the update-workout page with the respective ID of the selected workout in order to update the workout.
   *
   * @author Jia Hui Wang, u18080449
   */
  async sendWorkoutID(id: string){
      await this.router.navigate(["/update-workout"], {
          state:{
              id: id
          }
      });
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

  /**
   * eventHandler for the search functionality on the page to filter for specific cards based on the text
   *
   * @param event The onChange when user enters or removes characters to filter the cards
   * @author Jia Hui Wang, u18080449
   */
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

  /**
   * ActionSheet to display a list of options for the user to choose from, from emailing the pdf, video, or both, to downloading the pdf.
   *
   * @param pdf the base64 data of the image if the user wishes to download the file.
   * @param workoutID the id of the chosen workout should the user wish to choose either email option, then the data can be passed back to back-end to find the file and send it.
   * @author Jia Hui Wang, u18080449
   */
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
                  return true;
              }
          }, {
              text: "Email video to all clients",
              role: "selected",
              icon: "videocam-outline",
              handler: () => {
                  this.clientService.attemptEmailAllClientsVideo(workoutID);
                  return true;
              }
          }, {
              text: "Email PDF and video to all clients",
              role: "selected",
              icon: "documents-sharp",
              handler: () => {
                  this.clientService.attemptEmailAllClientsMedia(workoutID);
                  return true;
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
                  return true;
              }
          }, {
              text: "Cancel",
              icon: "close",
              role: "cancel",
              handler: () => false
          }]
      });
      await actionSheet.present();
      const {role} = await actionSheet.onDidDismiss();
      return role;
  }
}
