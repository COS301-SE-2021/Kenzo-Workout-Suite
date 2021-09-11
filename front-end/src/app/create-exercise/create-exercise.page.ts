import {Component, OnInit, ViewChild} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController, IonSearchbar} from "@ionic/angular";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Exercise} from "../Models/exercise";
import {KenzoTag} from "../Models/kenzo-tag";
import {Storage} from "@ionic/storage";

@Component({
    selector: "app-create-exercise",
    templateUrl: "./create-exercise.page.html",
    styleUrls: ["./create-exercise.page.scss"],
})
export class CreateExercisePage implements OnInit {
  title ="";
  description ="";
  range ="";
  sets: number ;
  poseDescription ="";
  rest: number;
  duration: number;
  images: string[];
  slideshow = new Array();

  tags: KenzoTag[] = new Array();
  tagBackup: KenzoTag[] = new Array();
  selected: KenzoTag[] = new Array();
  newTag: KenzoTag;

  @ViewChild("searchBar", {static: false}) searchbar: IonSearchbar;

  constructor(private http: HttpClient,
              private route: Router,
              public alertController: AlertController,
              private workoutService: WorkoutService,
              private storage: Storage) {
      this.storage.create();
      this.storage.set("images", []);
      this.storage.set("skeletons", []);
      this.getTags();
      this.newTag = this.getRandomTag("");
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
   *
   * @author Luca Azmanov, u19004185
   */
  async createExercise() {
      await this.syncFrames();

      const exercise = new Exercise(this.title, this.description, this.range, this.sets, this.poseDescription,
          this.rest, this.selected, this.duration*60, this.images);
      const status = await this.workoutService.attemptSubmitExercise(exercise);

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
              message: "Please fill all of the required fields.",
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

      const data = allTags.data;
      for (let i = 0; i < data.length; i++) {
          const tagsKey = data[i];
          const tg = new KenzoTag(tagsKey.textColour, tagsKey.backgroundColour, tagsKey.label, false);
          this.tags.push(tg);
          this.tagBackup.push(tg);
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
          this.tagBackup.push(this.newTag);
          this.newTag.selected = true;
          this.selected.push(this.newTag);
          this.searchbar.value = "";
          const resultArray = new Array();
          for (let i = 0; i < this.tagBackup.length; i++) {
              const tag = this.tagBackup[i];

              // if not selected
              if(!tag.selected){
                  resultArray.push(tag);
              }
          }

          this.tags = resultArray;
          document.getElementById("no-tag-create").style.display="none";
          this.newTag = this.getRandomTag("");

          if(this.selected.length===0){
              document.getElementById("selected").style.display = "none";
          }else {
              document.getElementById("selected").style.display = "block";
          }
          return;
      }

      const unselected = new Array();
      const selected = new Array();

      for (let i = 0; i < this.tags.length; i++) {
          const tag = this.tags[i];
          if (tag.label === id) {
              tag.selected = true;
          }
      }

      for (let i = 0; i < this.selected.length; i++) {
          const tag = this.selected[i];
          if (tag.label === id) {
              tag.selected = false;
          }
      }

      for (let i = 0; i < this.tagBackup.length; i++) {
          const tag = this.tagBackup[i];
          if(tag.selected){
              selected.push(tag);
          } else {
              unselected.push(tag);
          }
      }

      this.selected = selected;
      this.tags = unselected;

      if(this.selected.length===0){
          document.getElementById("selected").style.display = "none";
      }else {
          document.getElementById("selected").style.display = "block";
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
      this.tags = this.tagBackup;
      const resultArray = new Array();
      if(text==="" || text===null){
          document.getElementById("no-tag-create").style.display="none";
          return;
      }

      let exactMatch = false;
      for (let i = 0; i < this.tags.length; i++) {
          const tag = this.tags[i];

          // if not selected
          if(!tag.selected){
              const id = tag.label;

              // if tag label does contain the searched tag
              if(id.toLowerCase().trim().includes(text.toLowerCase())){
                  resultArray.push(tag);
              }

              if(id.toLowerCase().trim()===(text.toLowerCase())){
                  exactMatch = true;
              }
          } else {
              const id = tag.label;
              if(id.toLowerCase().trim()===(text.toLowerCase())){
                  exactMatch = true;
              }
          }
      }

      this.tags = resultArray;

      if(!exactMatch){
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

  /** This function moves the user to a screen which allows them to manipulate a 3D avatar into specific poses which can be framed
   * and used to depict the exercise
   *
   * @author Luca Azmanov, u1900415
   */
  async poseMaker() {
      await this.route.navigate(["/pose-maker"]);
  }

  /**
   * This function syncs the photos sent from the pose maker
   *
   * @author Luca Azmanov, u19004185
   */
  async syncFrames(){
      this.slideshow = new Array();
      this.images = await this.storage.get("images");
      for (let i=0; i<this.images.length; i++) {
          const image = this.images[i];
          if(image===undefined || image===null) {
              this.images[i] = null;
              continue;
          }
          this.slideshow.push(image);
      }

      if(this.images.length>0){
          document.getElementById("pose-button").innerHTML = "Edit Poses";
      }else{
          document.getElementById("pose-button").innerHTML = "Add Poses";
      }
  }

  /**
   * This function will hide or show the optional fields
   *
   * @author Luca Azmanov, u19004185
   */
  showOptional() {
      const options = document.getElementById("optionalFields");
      const expand = document.getElementById("expand");
      const hide = document.getElementById("hide");
      if(options.style.display === "block"){
          options.style.display = "none";
          hide.style.display = "none";
          expand.style.display = "inline-block";
      } else{
          options.style.display = "block";
          hide.style.display = "inline-block";
          expand.style.display = "none";
      }
  }
}
