import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {ExceptionCode} from "@capacitor/core";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  constructor(private http:HttpClient, private route:Router) { }

  ngOnInit() {
  }

  signIn() {
    const url : string = "http://localhost:5500/user/signIn";
    const body:Object = {
      "email": "luca@me.com",
      "password": "Test123!"
    };


    this.http.post(url, body).subscribe(data =>{
      // Success State
      console.log(data)
      this.route.navigate(['/create-exercise']);
    }, error => {
      // Invalid Sign In
      console.log(error)
    });


  }
}
