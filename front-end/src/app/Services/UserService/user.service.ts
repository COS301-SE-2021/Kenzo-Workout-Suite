import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http:HttpClient, private storage: Storage) {
    this.storage.create();
  }

  async AddToken(value:any): Promise<void>{
    await this.storage.set("Token", JSON.stringify(value));
  }

  async getToken(): Promise<JSON>{
    return await JSON.parse(await this.storage.get("Token"));
  }

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
      "username": email,
      "password": password
    };

    return this.http.post(url, body).toPromise().then(r => {
        this.AddToken(r);
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
    const url ="http://localhost:3000/user/signUp";;
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


    const body: Object = { //Object to be saved into DB
      user: {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "userType": accountType,
        "password": password
      }
    }

    return this.http.post(url, body).toPromise().then(r => {
      return 201;
    }).catch((error)=>{
      if(error.status==0) return 500;
      return error.status;
    });
  }

  async obtainUserDetails(): Promise<string>{
    let userToken = await this.getToken();
    const url ="http://localhost:3000/user/getUserDetails";

    const headers = {'Authorization': 'Bearer '+userToken['access_token']};
    console.log(headers);

    return this.http.get(url, {headers}).toPromise().then(r=>{
      return r;
    }).catch((error)=>{
      return error;
    });
  }

}
