import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Exercise} from "../Models/exercise";
import {KenzoTag} from "../Models/kenzo-tag";

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

  tags:KenzoTag[] = new Array();

  constructor(private http:HttpClient,
              private route:Router,
              public alertController:AlertController,
              private workoutService:WorkoutService) {
    this.getTags();
  }

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
      this.rest, this.diff, this.duration*60);
    let status = await this.workoutService.attemptSubmitExercise(exercise);

    if (status < 400) {
      // Success State
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Exercise Submitted',
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
        header: 'Could not create exercise',
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

  /**
   * Helper Function to physically present alert to user independent of OS.
   * @param alert
   */
  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }

  reloadWindow(){
    window.location.reload();
  }

  /** This function uses the server to retrieve an array of all possible tags for the system
   * With these tags, the user will be able to select tags for their exercise
   */
  getTags() {
    // Mocking tags for now
    this.tags.push(new KenzoTag("BLUE","BLUE","Leg Day", false));
    this.tags.push(new KenzoTag("GREEN","GREEN","Arms", false));
    this.tags.push(new KenzoTag("YELLOW","YELLOW","Chest Pump", false));
    this.tags.push(new KenzoTag("ORANGE","ORANGE","Level 4", false));
    this.tags.push(new KenzoTag("RED","RED","Pain", false));
    this.tags.push(new KenzoTag("PURPLE","PURPLE","Hard", false));
    this.tags.push(new KenzoTag("BLACK","PINK","Thighs", false));
    this.tags.push(new KenzoTag("BLACK","RED","Creatine", false));
  }

  /** This function serves the purpose of selecting and deselecting tags for the creation of an exercise
   *
   * @param id specifies the id of the tag selected/deselected
   *
   * If the selected tag is already selected it is returned to the unselected, else it is placed in the new selected choices
   */
  select(id) {
    for (let i = 0; i < this.tags.length; i++) {
      if (this.tags[i].label === id) {
        if(this.tags[i].selected){
          this.tags[i].selected = false;
          document.getElementById("tags").appendChild(document.getElementById(id));
        }
        else {
          this.tags[i].selected = true;
          document.getElementById("selected").appendChild(document.getElementById(id));
        }
      }
    }
  }

  /** This function is called upon input of the search bar and will filter the selection of tags
   * by the specified text. This function will be able to determine whether a tag is already
   * selected or not and decide whether it is appropriate to display this tag.
   *
   * i.e. If a tag is selected, it must not be displayed under search results
   */
  filterSelection(event) {
    let text = event.srcElement.value;

    for (let i = 0; i < this.tags.length; i++) {
      let tag = this.tags[i];

      // if not selected
      if(!tag.selected){
        let id = tag.label;
        let tagElement = document.getElementById(id);

        // if tag label contains the searched tag
        if(!id.toLowerCase().includes(text.toLowerCase())){
          tagElement.style.display = "none";
        }
        else{
          tagElement.style.display = "inline-block";
        }
      }
    }
  }
}
