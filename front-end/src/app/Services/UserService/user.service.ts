import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  /**
   *
   * @param email
   * @param password
   */
  async attemptSignIn(email: string, password: string): Promise<Number> {
    const url: string = "http://localhost:5500/user/signIn";

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
}
