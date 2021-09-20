import { Component, OnInit } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import {UserService} from "../Services/UserService/user.service";

@Component({
    selector: "app-sign-up",
    templateUrl: "./sign-up.page.html",
    styleUrls: ["./sign-up.page.scss"],
})
export class SignUpPage implements OnInit {
  firstName = "";
  lastName = "";
  email = "";
  password = "";
  confirmpassword = "";
  accountType = "PLANNER";
  url: string;

  constructor(private http: HttpClient,
              private route: Router,
              public alertController: AlertController,
              private userService: UserService) { }

  ngOnInit() {
  }

  /**
   * Function to be called upon button onClick to signUp
   * where a user's details will be obtained from the input fields
   * then processed through the userService's attemptSignUp function,
   * from there the attemptSignUp will return a response code based on the success of the sign up
   * and from that code we return a human understandable message.
   *
   * @author Jia Hui Wang, u18080449
   */
  async signUp() {
      if(!await this.validateCredentials()){
          return;
      }
      if(!await this.validateEmail()){
          return;
      }
      if(!await this.validatePassword()) {
          return;
      }
      if (this.password === this.confirmpassword) {
          const status = await this.userService.attemptSignUp(this.firstName, this.lastName, this.email, this.password, this.accountType);
          if (status < 400 && status >=200){
              const alert = await this.alertController.create({
                  cssClass: "kenzo-alert",
                  header: "Sign up Successful",
                  message: "Your account has been registered successfully.",
                  buttons: ["Sign In"]
              });
              await this.presentAlert(alert);
              await this.route.navigate(["/your-workouts"]);
              return 200;
          } else if (status >= 400 && status < 500) {
          //Invalid entry or already existent client email
              const alert = await this.alertController.create({
                  cssClass: "kenzo-alert",
                  header: "Incorrect Signup",
                  message: "Your details are invalid or an account with the email already exists.",
                  buttons: ["OK"]
              });
              await this.presentAlert(alert);
              return new Error("User credentials are incorrect.");
          } else if (status >= 500) {
              const alert = await this.alertController.create({
                  cssClass: "kenzo-alert",
                  header: "Server isn't Responding",
                  message: "Please try again later.",
                  buttons: ["Dismiss"]
              });
              await this.presentAlert(alert);
              return new Error("Server is not responding.");
          }
      } else {
          await this.invalidPasswords(); //If passwords do not match, notify User through an alert.
      }
  }
  async validateCredentials(){
      if(this.firstName==="" || this.lastName===""){
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Invalid Credentials",
              message: "Please ensure your name and surname are filled in.",
              buttons: ["Dismiss"]
          });
          await this.presentAlert(alert);
          return false;
      }
      return true;
  }
  async validateEmail() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(String(this.email).toLowerCase())){
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Email is Invalid",
              message: "Please check your email's format.",
              buttons: ["OK"]
          });
          await this.presentAlert(alert);
          return false;
      }
      return true;
  }
  async validatePassword() {
      // Validate Password
      const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!re.test(this.password)){
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Password is invalid",
              message: "Please ensure that your password matches the criteria.",
              buttons: ["OK"]
          });
          await this.presentAlert(alert);
          return false;
      }
      if(this.password!==this.confirmpassword){
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Passwords do not match",
              message: "Please ensure that your password matches the confirmation password.",
              buttons: ["OK"]
          });
          await this.presentAlert(alert);
          return false;
      }
      return true;
  }

  /**
   * Helper function to be called if both passwords do not match.
   *
   * @author Jia Hui Wang, u18080449
   */
  async invalidPasswords() {
      const alert = await this.alertController.create({
          cssClass: "kenzo-alert",
          header: "Invalid Passwords",
          message: "Your passwords do not match. Please try again.",
          buttons: ["OK"]
      });
      await this.presentAlert(alert);
  }

  /**
   * Helper function to physically present alert to User independent of OS.
   *
   * @author Jia Hui Wang, u18080449
   */
  async presentAlert(alert: any){
      await alert.present();
      await alert.onDidDismiss();
  }
}
