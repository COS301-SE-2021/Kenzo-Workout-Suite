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
    const url : string = "https://jsonplaceholder.typicode.com/posts";
    const body:Object = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    };


    this.http.post(url, body).subscribe(data =>{
      console.log(data)
      this.route.navigate(['/create-exercise']);
    }, error => {
      console.log(error)
    });


  }
}
