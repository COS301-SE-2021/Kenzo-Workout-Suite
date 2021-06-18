import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController, IonSearchbar} from "@ionic/angular";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Workout} from "../Models/workout";
import {KenzoTag} from "../Models/kenzo-tag";

@Component({
  selector: 'app-create-workout',
  templateUrl: './create-workout.page.html',
  styleUrls: ['./create-workout.page.scss'],
})
export class CreateWorkoutPage implements OnInit {
  diff: string="";
  description: string="";
  title: string="";

  tags:KenzoTag[] = new Array();
  finalTags:KenzoTag[] = new Array();
  newTag: KenzoTag;

  @ViewChild('searchBar', {static: false}) searchbar: IonSearchbar;

  constructor(private http:HttpClient,
              private route:Router,
              private workoutService:WorkoutService,
              public alertController:AlertController,) {
    this.getTags();
    this.newTag = this.getRandomTag("TEST");
  }

  ngOnInit() {
  }

  /** This function uses the workout service to submit a request to create a workout.
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
  async submitCreateRequest() {
    let new_workout = new Workout(this.title, this.description, this.diff);
    let status = await this.workoutService.attemptSubmitWorkout(new_workout);

    if (status < 400) {
      // Success State
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Workout Submitted',
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
        header: 'Could not create workout',
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
   * @author Luca Azmanov, u19004185
   */
  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }

  reloadWindow(){
    window.location.reload();
  }

  /** This function uses the server to retrieve an array of all possible tags for the system
   * With these tags, the user will be able to select tags for their workouts
   *
   * @author Luca Azmanov, u19004185
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
  }

  /** This function serves the purpose of selecting and deselecting tags for the creation of a workout
   *
   * @param id specifies the id of the tag selected/deselected
   *
   * If the selected tag is already selected it is returned to the unselected, else it is placed in the new selected choices
   *
   * @author Luca Azmanov, u19004185
   */
  select(id) {
    if(id===this.newTag.label && !this.newTag.selected){
      this.tags.push(this.newTag);
      this.reset(id);
      this.newTag = this.getRandomTag("");
      return;
    }

    for (let i = 0; i < this.tags.length; i++) {
      let tag = this.tags[i];
      if (tag.label === id) {
        if(tag.selected){
          tag.selected = false;
          document.getElementById("tags").appendChild(document.getElementById(id));
        }
        else {
          tag.selected = true;
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
   *
   * @author Luca Azmanov, u19004185
   */
  filterSelection(event) {
    let text = event.srcElement.value;

    let found = false;
    for (let i = 0; i < this.tags.length; i++) {
      let tag = this.tags[i];

      if(tag.label.toLowerCase().includes(text.toLowerCase())) found = true;

      // if not selected
      if(!tag.selected){
        let id = tag.label;
        let tagElement = document.getElementById(id);

        // if tag label does not contain the searched tag
        if(!id.toLowerCase().includes(text.toLowerCase())){
          tagElement.style.display = "none";
        }
        else{ // if tag label contains the searched tag
          tagElement.style.display = "inline-block";
        }
      }
    }

    if(!found){
      document.getElementById("no-tag-create").style.display="block";
      this.newTag.label = text;
    }
    else{
      document.getElementById("no-tag-create").style.display="none";
    }

  }

  /** This function serves the purpose of resetting the selection div after
   * the addition of a new tag is performed
   *
   * @param label is the name to be displayed after creation
   *
   * @author Luca Azmanov, u19004185
   */
  reset(label) {
    this.searchbar.value = label;
    let text = label;

    for (let i = 0; i < this.tags.length; i++) {
      let tag = this.tags[i];

      // if not selected
      if(!tag.selected){
        let id = tag.label;
        let tagElement = document.getElementById(id);

        // if tag label does not contain the searched tag
        if(!id.toLowerCase().includes(text.toLowerCase())){
          tagElement.style.display = "none";
        }
        else{ // if tag label contains the searched tag
          tagElement.style.display = "inline-block";
        }
      }
    }
    document.getElementById("no-tag-create").style.display="none";
  }

  /** This function creates a new random tag with random colors and waits for the new
   * specified label
   * @param label is the name for new newly created tag
   * @author Luca Azmanov, u19004185
   */
  getRandomTag(label) : KenzoTag{
    let colors = ["RED","PINK","PURPLE","BLUE","YELLOW","ORANGE","GREEN"];

    let randomTC = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
    let randomBC = Math.floor(Math.random() * (6 - 0 + 1)) + 0;

    return new KenzoTag(colors[randomTC],colors[randomBC],label, false);
  }
}
