import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { UserService } from "../Services/UserService/user.service";

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

  constructor(private http:HttpClient, private userService: UserService) { }

  ngOnInit() {
    this.getDetails();
  }

  /**
   * Get the details of the user through an API call
   */
  async getDetails(){
    let UserDetails = await this.userService.obtainUserDetails();
    console.log(UserDetails);
  }

}
