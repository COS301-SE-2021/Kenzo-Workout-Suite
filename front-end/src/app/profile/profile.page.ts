import { Component, OnInit } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { UserService } from "../Services/UserService/user.service";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.page.html",
    styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: any;
  accountType: string;

  constructor(private http: HttpClient,
              private userService: UserService,
              public alertController: AlertController,
              private router: Router) { }

  ngOnInit() {
      this.getDetails();
  }

  /**
   * Get the details of the User through an API call
   */
  async getDetails(){
      const userDetails = await this.userService.obtainUserDetails();
      this.firstName = userDetails["firstName"];
      this.lastName = userDetails["lastName"];
      this.birthDate = userDetails["dateOfBirth"];
      if (this.birthDate != null){
          this.birthDate = this.birthDate.substring(0, 10);
      }
      this.email = userDetails["email"];
      this.accountType = userDetails["userType"];
  }

  /**
   * Change form to allow editing of details
   */
  editDetails(){
      const userInputs = document.getElementsByClassName("enable-input") as HTMLCollectionOf<HTMLElement>;
      for (let i =0; i<userInputs.length; i++){
          userInputs[i].setAttribute("disabled", "false");
      }
      const editBtn = document.getElementById("editBtn");
      editBtn.style.visibility = "hidden";
      editBtn.style.display = "none";

      const updateBtn = document.getElementById("updateBtn");
      updateBtn.style.visibility = "visible";
      updateBtn.setAttribute("disabled", "false");
  }

  /**
   * Send request to update details of User
   */
  async updateDetails(){
      const userInputs = document.getElementsByClassName("enable-input") as HTMLCollectionOf<HTMLElement>;
      for (let i =0; i<userInputs.length; i++){
          userInputs[i].setAttribute("disabled", "true");
      }
      const editBtn = document.getElementById("editBtn");
      editBtn.style.visibility = "visible";
      editBtn.style.display = "block";

      const updateBtn = document.getElementById("updateBtn");
      updateBtn.style.visibility = "hidden";
      updateBtn.setAttribute("disabled", "true");

      const status = await this.userService.attemptUpdateUserDetails(this.firstName, this.lastName, this.birthDate);
      if (status === 200) {
      // Success State
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Updated details.",
              message: "Your account details have updated successfully.",
              buttons: ["OK"]
          });
          await this.presentAlert(alert);
      } else if (status === 401) {
      // Invalid Sign In
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Unauthorized User",
              message: "You are not authorized to update these details.",
              buttons: ["OK"]
          });
          await this.presentAlert(alert);
      } else {
      // Server Error
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Server isn't responding",
              message: "Unable to update details due to server, please try again later.",
              buttons: ["Dismiss"]
          });
          await this.presentAlert(alert);
      }
      this.reloadWindow();
      return status;
  }

  /**
   * Helper Function to physically present alert to User independent of OS.
   *
   * @param alert
   */
  async presentAlert(alert: any) {
      await alert.present();
      await alert.onDidDismiss();
  }

  reloadWindow(){
      window.location.reload();
  }

  async goToFYP(){
      await this.router.navigate(["/your-workouts"])
          .then(() => {
              window.location.reload();
          });
  }

  async goToSearch(){
      await this.router.navigate(["/search"])
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
}
