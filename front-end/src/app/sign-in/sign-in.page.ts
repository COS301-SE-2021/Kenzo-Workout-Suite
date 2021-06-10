import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {ExceptionCode} from "@capacitor/core";
import {AlertController} from "@ionic/angular";
import {UserService} from "../Services/UserService/user.service";
import {Alerts} from "../Models/alerts";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  email: string;
  password: string;
  alertGetter:any;
  constructor(private http:HttpClient,
              private route:Router,
              public alertController:AlertController,
              private userService:UserService,) {
      this.alertGetter = new Alerts(this.alertController);
  }

  ngOnInit() {
  }

  /**
   *
   */
  async signIn() {
    let status = await this.userService.attemptSignIn(this.email, this.password);
    if (status < 400) {
      // Success State
      await this.route.navigate(['/your-workouts']);
    }
    else if (status >= 400 && status < 500) {
      // Invalid Sign In
      // await this.presentAlert(this.alertGetter.INCORRECT_DETAILS);
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Incorrect login',
        message: 'Either your password or email is incorrect.',
        buttons: ['OK']
      });
      await this.presentAlert(alert);
    }
    else {
      // Server Error
      // await this.presentAlert(await this.alertGetter.SERVER_ERROR);
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: "Server isn't responding",
        message: 'Please try again later.',
        buttons: ['Dismiss']
      });
      await this.presentAlert(alert);
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
}
