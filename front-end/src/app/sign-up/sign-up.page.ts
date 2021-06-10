import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AlertController} from "@ionic/angular";
import {UserService} from "../Services/UserService/user.service";
import {Alerts} from "../Models/alerts";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmpassword: string;
  accountType: string;
  url: string;

  constructor(private http:HttpClient,
              private route:Router,
              public alertController:AlertController,
              private userService:UserService) { }

  ngOnInit() {
  }


  /**
   * Function to be called upon button onClick to determine if the account is a Planner account
   * @constructor
   */
  PlannerAccount() {
    this.accountType="Planner";
  }

  /**
   * Function to be called upon button onClick to determine if the account is a Client account
   * @constructor
   */
  ClientAccount() {
    this.accountType="Client";
  }

  async signUp() {
    if (this.accountType == "Planner")
      this.url = "http://localhost:5500/user/signupPlanner";
    if (this.accountType == "Client")
      this.url = "http://localhost:5500/user/signupClient";

    if (this.password == this.confirmpassword) {
      let status = await this.userService.attemptSignUp(this.firstName, this.lastName, this.email, this.password, this.url);
        if (status < 400 && status >=200){
            await this.route.navigate(['/sign-in']);
        }
        else if (status >= 400 && status < 500) {
          //Invalid entry or already existent client email
          const alert = await this.alertController.create({
            cssClass: 'kenzo-alert',
            header: 'Incorrect Signup',
            message: 'Your details are invalid or an account with the email already exists.',
            buttons: ['OK']
          });
          await this.presentAlert(alert);
        } else if (status >= 500) {
          const alert = await this.alertController.create({
            cssClass: 'kenzo-alert',
            header: 'Server isn\'t responding',
            message: 'Please try again later.',
            buttons: ['Dismiss']
          });
          await this.presentAlert(alert);
        }
    }
    else {
      await this.InvalidPasswords();  //If passwords do not match, notify user
    }                           //through an alert.
  }

  /**
   * Helper function to be called if both passwords do not match.
   * @constructor
   */
  async InvalidPasswords() {
    const alert = await this.alertController.create({
      cssClass: 'kenzo-alert',
      header: 'Invalid Passwords',
      message: 'Your passwords do not match. Please try again.',
      buttons: ['OK']
    });
    await this.presentAlert(alert);
  }

  /**
   * Helper function to physically present alert to user independent of OS.
   * @param alert
   */
  async presentAlert(alert:any){
    await alert.present();
    await alert.onDidDismiss();
  }
}
