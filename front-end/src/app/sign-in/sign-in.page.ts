import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {ExceptionCode} from "@capacitor/core";
import {AlertController} from "@ionic/angular";
import {UserService} from "../Services/UserService/user.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  email: string;
  password: string;

  constructor(private http:HttpClient,
              private route:Router,
              public alertController:AlertController,
              private userService:UserService) { }

  ngOnInit() {
  }

  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }

  async signIn() {
    let status = await this.userService.attemptSignIn(this.email, this.password);
    if (status < 400) {
      await this.route.navigate(['/your-workouts']);
    }
    else if (status => 400 && status < 500) {
      // Invalid Sign In
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Incorrect login',
        message: 'Either your password or email is incorrect.',
        buttons: ['OK']
      });
      await this.presentAlert(alert);
    }
    else {
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: "Server isn't responding",
        message: 'Please try again later.',
        buttons: ['Dismiss']
      });
      await this.presentAlert(alert);
    }
  }
}
