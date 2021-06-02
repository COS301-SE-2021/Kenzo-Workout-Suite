import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AlertController} from "@ionic/angular";

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
              public alertController:AlertController) { }

  ngOnInit() {
  }

  async presentAlert(alert:any){
    await alert.present();
    await alert.onDidDismiss();
  }

  PlannerAccount() {
    this.accountType="Planner";
  }

  ClientAccount() {
    this.accountType="Clent";
  }

  signUp() {
    if (this.accountType=="Planner")
      this.url = "http://localhost:5500/user/signupPlanner";
    if (this.accountType=="Client")
      this.url = "http://localhost:5500/user/signupClient";
    if (this.firstName==null) {
      this.firstName = "";
    }
    if (this.lastName==null) {
      this.lastName = "";
    }
    if (this.email==null){
      this.email = "";
    }
    if (this.accountType==null){
      this.accountType= "";
    }
    if (this.password==null){
      this.password="";
    }
    if (this.confirmpassword==null){
      this.confirmpassword="";
    }

    const body:Object = { //Object to be saved into DB
      "firstName": this.firstName,
      "lastName": this.lastName,
      "email": this.email,
      "password": this.password
    }

    this.http.post(this.url, body).subscribe(data => {
      // Successfully saved
      this.route.navigate(['/sign-in']);
      }, async error => {
      if (error.status == 400) {
        //Invalid entry or already existent client email
        const alert = await this.alertController.create({
          cssClass: 'kenzo-alert',
          header: 'Incorrect Signup',
          message: 'Your details are invalid or an account with the email already exists.',
          buttons: ['OK']
        });
        this.presentAlert(alert);
      }else if (error.status == 500) {
        const alert = await this.alertController.create({
          cssClass: 'kenzo-alert',
          header: 'Incorrect Signup',
          message: 'Your details are invalid or an account with the email already exists.',
          buttons: ['OK']
        });
        this.presentAlert(alert);
      }
    });
  }
}
