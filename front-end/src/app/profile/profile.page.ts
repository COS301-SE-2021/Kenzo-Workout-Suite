import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  firstName: string;
  lastName: string;
  birthDate: any;
  email: any;
  accountType: string;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.getDetails();
  }

  getDetails(){

  }

}
