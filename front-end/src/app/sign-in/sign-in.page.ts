import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {ExceptionCode} from "@capacitor/core";
import {AlertController} from "@ionic/angular";

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
              public alertController:AlertController) { }

  ngOnInit() {
  }

  async presentAlert(alert:any) {
    await alert.present();
    await alert.onDidDismiss();
  }

  signIn() {
    const url : string = "http://localhost:5500/user/signIn";
    const body:Object = {
      "email": this.email,
      "password": this.password
    };

    this.http.post(url, body).subscribe(data =>{
      // Success State
      this.route.navigate(['/your-workouts']);
    }, async error => {
      if(error.status==401 || error.status==400) {
        // Invalid Sign In
        console.log(error.status);
        const alert = await this.alertController.create({
          cssClass: 'kenzo-alert',
          header: 'Incorrect login',
          message: 'Either your password or email is incorrect.',
          buttons: ['OK']
        });
        this.presentAlert(alert);
      }else{
        const alert = await this.alertController.create({
          cssClass: 'kenzo-alert',
          header: "Server isn't responding",
          message: 'Please try again later.',
          buttons: ['Dismiss']
        });
        this.presentAlert(alert);
      }
    });
  }
}
