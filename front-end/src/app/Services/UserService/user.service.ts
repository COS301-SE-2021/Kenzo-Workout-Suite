import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient) { }

  /** This function attempts to submit a workout by using the following parameters:
   *
   * @param email is the email the user is attempting to login with.
   * @param password is the password the user is attempting to login with.
   *
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, user error and server error, respectively.
   */
  async attemptSignIn(email: string, password: string): Promise<Number> {
    const url: string = "http://localhost:3000/user/login";

    //Client Validation
    if (email == null) {
      email = "";
    }

    if (password == null) {
      password = "";
    }
    const body: Object = {
      "email": email,
      "password": password
    };

    return this.http.post(url, body).toPromise().then(r => {
          return 200;
        }).catch((error)=>{
        if(error.status==0) return 500;
        return error.status;
      });
  }

  /**
   * Attempt to register a new user.
   * @param firstName
   * @param lastName
   * @param email
   * @param password
   * @param accountType
   */
  async attemptSignUp(firstName: string, lastName: string, email: string, password: string, accountType: string): Promise<Number>{
    let url = "";
    if (firstName == null) {
      firstName = "";
    }
    if (lastName == null) {
      lastName = "";
    }
    if (email == null) {
      email = "";
    }
    if (password == null) {
      password = "";
    }
    if (accountType == "Planner")
      url = "http://localhost:3000/user/signupPlanner";
    if (accountType == "Client")
      url = "http://localhost:3000/user/signupClient";

    const body: Object = { //Object to be saved into DB
      "firstName": firstName,
      "lastName": lastName,
      "email": email,
      "password": password
    }

    return this.http.post(url, body).toPromise().then(r => {
      return 200;
    }).catch((error)=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }
}
