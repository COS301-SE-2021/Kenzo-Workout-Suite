import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AlertController} from "@ionic/angular";
import {UserService} from "../Services/UserService/user.service";

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

  async presentAlert(alert:any){
    await alert.present();
    await alert.onDidDismiss();
  }

  async InvalidPasswords() {
    const alert = await this.alertController.create({
      cssClass: 'kenzo-alert',
      header: 'Invalid Passwords',
      message: 'Your passwords do not match. Please try again.',
      buttons: ['OK']
    });
    this.presentAlert(alert);
  }

  PlannerAccount() {
    this.accountType="Planner";
  }

  ClientAccount() {
    this.accountType="Client";
  }

  signUp() {
    if (this.accountType == "Planner")
      this.url = "http://localhost:5500/user/signupPlanner";
    if (this.accountType == "Client")
      this.url = "http://localhost:5500/user/signupClient";
    if (this.firstName == null) {
      this.firstName = "";
    }
    if (this.lastName == null) {
      this.lastName = "";
    }
    if (this.email == null) {
      this.email = "";
    }
    if (this.accountType == null) {
      this.accountType = "";
    }
    if (this.password == null) {
      this.password = "";
    }
    if (this.confirmpassword == null) {
      this.confirmpassword = "";
    }

    const body: Object = { //Object to be saved into DB
      "firstName": this.firstName,
      "lastName": this.lastName,
      "email": this.email,
      "password": this.password
    }

    if (this.password == this.confirmpassword) {
      let status = await this.userService.attemptSignUp()
        if (status < 400){
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
          this.presentAlert(alert);
        } else if (status >= 500) {
          const alert = await this.alertController.create({
            cssClass: 'kenzo-alert',
            header: 'Incorrect Signup',
            message: 'Your details are invalid or an account with the email already exists.',
            buttons: ['OK']
          });
          this.presentAlert(alert);
        }
    }
    else {
      this.InvalidPasswords();  //If passwords do not match, notify user
    }                           //through an alert.
  }
}
