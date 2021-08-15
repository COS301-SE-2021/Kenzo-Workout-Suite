import {Component, OnInit, ViewChild} from "@angular/core";
import {KenzoTag} from "../Models/kenzo-tag";
import {AlertController, IonSearchbar} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Exercise} from "../Models/exercise";

@Component({
    selector: "app-update-exercise",
    templateUrl: "./update-exercise.page.html",
    styleUrls: ["./update-exercise.page.scss"],
})
export class UpdateExercisePage implements OnInit {

  title: string;
  description: string;
  range: string;
  sets: number;
  poseDescription: string;
  rest: number;
  duration: number;
  images: string[];

  tags: KenzoTag[] = new Array();
  newTag: KenzoTag;

  @ViewChild("searchBar", {static: false}) searchbar: IonSearchbar;
  id: string;

  constructor(private http: HttpClient,
              private route: Router,
              public alertController: AlertController,
              private workoutService: WorkoutService) {
      this.newTag = this.getRandomTag("");
      this.id = route.getCurrentNavigation().extras.state.id;
  }

  ngOnInit() {
      this.getDetails();
  }

  async getDetails(){
      await this.getTags();
      const exercises = await this.workoutService.attemptGetExercises();
      const data = exercises["data"];
      let unit;
      for (let i = 0; i < data.length; i++) {
          unit = data[i];
          if(unit["exerciseID"]===this.id){
              break;
          }
      }
      this.title = unit["exerciseTitle"];
      this.description = unit["exerciseDescription"];
      this.range = unit["repRange"];
      this.sets = unit["sets"];
      this.poseDescription = unit["poseDescription"];
      this.rest = unit["restPeriod"];
      this.duration = unit["duration"];
      this.images = unit["images"];

      const tags = unit["tags"];
      for (let i=0; i<tags.length; i++) {
          const currTag = tags[i];
          for (let j = 0; j < this.tags.length; j++) {
              if(this.tags[j].label===currTag["label"]){
                  document.getElementById(this.tags[j].label).click();
              }
          }
      }
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
   *
   * @author Luca Azmanov, u19004185
   */
  async submitUpdateRequest() {
      const selected: KenzoTag[] = new Array();
      for (let i = 0; i < this.tags.length; i++) {
          if(this.tags[i].selected){
              selected.push(this.tags[i]);
          }
      }

      const exercise = new Exercise(this.title, this.description, this.range, this.sets, this.poseDescription,
          this.rest, selected, this.duration*60, this.images);
      const status = await this.workoutService.attemptUpdateExercise(exercise, this.id);

      if (status < 400) {
      // Success State
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Exercise Submitted",
              buttons: ["Go Back"]
          });

          await this.presentAlert(alert);
          this.route.navigate(["/search"]).then(()=>{
              this.reloadWindow();
          }
          );
          return 200;
      } else if(status>=400 && status<500){
      // Invalid Input
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Could not create exercise",
              message: "Please fill all of the fields.",
              buttons: ["Dismiss"]
          });

          await this.presentAlert(alert);
          throw new Error("Data is invalid.");
      } else{
      // Server Error
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Server isn't responding",
              message: "Please try again later.",
              buttons: ["Dismiss"]
          });
          await this.presentAlert(alert);
          throw new Error("Server is not responding.");
      }
  }

  /** This function uses the workout service to submit a request to delete an exercise.
   * The workout service will return the status of the request:
   * 200 -> Success
   * 400 -> Error
   * 500 -> Server not responding
   *
   * Thereafter,
   * Error states [400,500] will result in an alert
   * Success states [200] will result in a logged in a Planner being navigated to the logged in User's homescreen.
   *
   * @author Luca Azmanov, u19004185
   */
  async submitDeleteRequest() {
      let confirmation = false;
      let alert = await this.alertController.create({
          cssClass: "kenzo-alert",
          header: "Are you sure you would like to delete this exercise?",
          buttons: [{text:"Delete",
              handler: ()=>{
                  confirmation = true;
              }}, "Cancel"]
      });

      await this.presentAlert(alert);
      if(!confirmation) {
          return;
      }

      const status = await this.workoutService.attemptRemoveExercise(this.id);

      if (status < 400) {
      // Success State
          alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Exercise Deleted",
              buttons: ["Go Back"]
          });

          await this.presentAlert(alert);
          this.route.navigate(["/search"]).then(()=>{
              this.reloadWindow();
          }
          );
          return 200;
      } else if(status>=400 && status<500){
      // Invalid Input
          alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Could not delete exercise",
              message: "Please try again later.",
              buttons: ["Dismiss"]
          });

          await this.presentAlert(alert);
          throw new Error("Data is invalid.");
      } else{
      // Server Error
          alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Server isn't responding",
              message: "Please try again later.",
              buttons: ["Dismiss"]
          });
          await this.presentAlert(alert);
          throw new Error("Server is not responding.");
      }
  }

  /**
   * Helper Function to physically present alert to User independent of OS.
   *
   * @param alert
   * @author Luca Azmanov, u19004185
   */
  async presentAlert(alert: any) {
      await alert.present();
      await alert.onDidDismiss();
  }

  reloadWindow(){
      window.location.reload();
  }

  /** This function uses the server to retrieve an array of all possible tags for the system
   * With these tags, the User will be able to select tags for their exercise
   *
   * @author Luca Azmanov, u19004185
   */
  async getTags() {
      const allTags = await this.workoutService.getTags();

      const data = allTags["data"];
      for (let i = 0; i < data.length; i++) {
          const tagsKey = data[i];
          const tg = new KenzoTag(tagsKey["textColour"], tagsKey["backgroundColour"], tagsKey["label"], false);
          this.tags.push(tg);
      }
  }

  /** This function serves the purpose of selecting and deselecting tags for the creation of an exercise
   *
   * @param id specifies the id of the tag selected/deselected
   *
   * If the selected tag is already selected it is returned to the unselected, else it is placed in the new selected choices
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
          const tag = this.tags[i];
          if (tag.label === id) {
              if(tag.selected){
                  tag.selected = false;
                  document.getElementById("tags").appendChild(document.getElementById(id));
              } else {
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
   * @param event contains the result of the search
   *
   * i.e. If a tag is selected, it must not be displayed under search results
   * @author Luca Azmanov, u19004185
   */
  filterSelection(event) {
      const text = event.srcElement.value.trim();
      if(text===""){
          document.getElementById("no-tag-create").style.display="none";
          return;
      }

      let found = false;
      for (let i = 0; i < this.tags.length; i++) {
          const tag = this.tags[i];

          if(tag.label.toLowerCase()===(text.toLowerCase())) {
              found = true;
          }

          // if not selected
          if(!tag.selected){
              const id = tag.label;
              const tagElement = document.getElementById(id);

              // if tag label does not contain the searched tag
              if(!id.toLowerCase()===(text.toLowerCase())){
                  tagElement.style.display = "none";
              } else{ // if tag label contains the searched tag
                  tagElement.style.display = "inline-block";
              }
          }
      }

      if(!found){
          document.getElementById("no-tag-create").style.display="block";
          this.newTag.label = text;
      } else{
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
      const text = label;

      for (let i = 0; i < this.tags.length; i++) {
          const tag = this.tags[i];

          // if not selected
          if(!tag.selected){
              const id = tag.label;
              const tagElement = document.getElementById(id);

              // if tag label does not contain the searched tag
              if(!id.toLowerCase().includes(text.toLowerCase())){
                  tagElement.style.display = "none";
              } else{ // if tag label contains the searched tag
                  tagElement.style.display = "inline-block";
              }
          }
      }
      document.getElementById("no-tag-create").style.display="none";
  }

  /** This function creates a new random tag with random colors and waits for the new
   * specified label
   *
   * @param label is the name for new newly created tag
   * @author Luca Azmanov, u19004185
   */
  getRandomTag(label): KenzoTag{
      const colors = ["RED", "PINK", "PURPLE", "BLUE", "YELLOW", "ORANGE", "GREEN"];

      const randomTC = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
      const randomBC = Math.floor(Math.random() * (6 - 0 + 1)) + 0;

      return new KenzoTag(colors[randomTC], colors[randomBC], label, false);
  }

}
