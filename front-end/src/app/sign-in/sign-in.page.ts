import { Component, OnInit } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {UserService} from "../Services/UserService/user.service";

import { GoogleAuthProvider } from "firebase/auth";


@Component({
    selector: "app-sign-in",
    templateUrl: "./sign-in.page.html",
    styleUrls: ["./sign-in.page.scss"],
})
export class SignInPage implements OnInit {
  email: string;
  password: string;
  userData: any = {};


  provider = new GoogleAuthProvider();

  constructor(private http: HttpClient,
              private route: Router,
              public alertController: AlertController,
              private userService: UserService) {
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
      const status = await this.userService.attemptSignIn(this.email, this.password);
      if (status < 400) {
      // Success State
          await this.route.navigate(["/your-workouts"]);
          return 200;
      } else if (status >= 400 && status < 500) {
      // Invalid Sign In
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Incorrect login",
              message: "Either your password or email is incorrect.",
              buttons: ["OK"]
          });
          await this.presentAlert(alert);
          throw new Error("User credentials are incorrect.");
      } else {
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

  async googleSignIn(){
      const res = await this.userService.attemptGoogleLogin();
      if (res < 400) {
      // Success State
          await this.route.navigate(["/your-workouts"]);
          return 200;
      } else if (res["status"] >= 400 && res["status"] < 500) {
      // Invalid Sign In
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Incorrect login",
              message: res["message"],
              buttons: ["OK"]
          });
          await this.presentAlert(alert);
          throw new Error("User error.");
      } else {
      // Server Error
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Server isn't responding",
              message: res["message"],
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
   */
  async presentAlert(alert: any) {
      await alert.present();
      await alert.onDidDismiss();
  }
}
