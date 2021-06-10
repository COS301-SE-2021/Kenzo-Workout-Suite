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

  constructor(private http:HttpClient,
              private route:Router,
              public alertController:AlertController,
              private userService:UserService,
              private alertGetter:Alerts) { }

  ngOnInit() {
  }

  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
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
    else if (status => 400 && status < 500) {
      // Invalid Sign In
      await this.presentAlert(alert);
    }
    else {
      // Server Error
      await this.presentAlert(this.alertGetter.INCORRECT_DETAILS);
    }
  }
}
