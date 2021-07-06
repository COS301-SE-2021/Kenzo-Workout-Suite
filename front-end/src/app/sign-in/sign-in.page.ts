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
              private userService:UserService,) {
  }

  ngOnInit() {
  }

  /** This function uses the email and password entered to attempt a sign in through the User service.
   * The User service will return the status of the login:
   * 200 -> Success
   * 400 -> Incorrect Credentials
   * 500 -> Server not responding
   *
   * Error states [400,500] will result in an alert
   * Success states [200] will result in a logged in User being navigated to the logged in User's homescreen.
   */
  async signIn() {
    let status = await this.userService.attemptSignIn(this.email, this.password);
    if (status < 400) {
      // Success State
      await this.route.navigate(['/your-workouts']);
      return 200;
    }
    else if (status >= 400 && status < 500) {
      // Invalid Sign In
      const alert = await this.alertController.create({
        cssClass: 'kenzo-alert',
        header: 'Incorrect login',
        message: 'Either your password or email is incorrect.',
        buttons: ['OK']
      });
      await this.presentAlert(alert);
      throw new Error("User credentials are incorrect.");
    }
    else {
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
   * Helper Function to physically present alert to User independent of OS.
   * @param alert
   */
  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }
}
