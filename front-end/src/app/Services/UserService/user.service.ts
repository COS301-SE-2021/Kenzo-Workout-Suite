import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Storage } from "@ionic/storage";

import {root} from "rxjs/internal-compatibility";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

@Injectable({
    providedIn: "root"
})
export class UserService {
  firebaseConfig = {
      apiKey: "AIzaSyA83P-n_PhbuKZi4Vc8YzqkK1Q4S0yi8Ag",
      authDomain: "kenzo-workout-suite.firebaseapp.com",
      projectId: "kenzo-workout-suite",
      storageBucket: "kenzo-workout-suite.appspot.com",
      messagingSenderId: "201037185690",
      appId: "1:201037185690:web:33e899d5a3e3dc4b6e1523",
      measurementId: "G-4DYHDREX4G"
  };

  constructor(private http: HttpClient,
                private storage: Storage) {
      this.storage.create();
  }

  /**
   * Add the token to ionic storage
   *
   * @param value
   */
  addToken(value: any) {
      root.auth = value;
      this.storage.set("Token", JSON.stringify(value));
  }

  /** This function attempts to submit a workout by using the following parameters:
   *
   * @param email is the email the User is attempting to login with.
   * @param password is the password the User is attempting to login with.
   *
   * @return Number represents the status of the Http request.
   *
   * @returns 200,400,500 represent a success, User error and server error, respectively.
   */
  async attemptSignIn(email: string, password: string): Promise<number> {
      const url = "http://localhost:3000/user/login";

      //Client Validation
      if (email == null) {
          email = "";
      }

      if (password == null) {
          password = "";
      }
      const body = {
          username: email,
          password: password
      };

      return this.http.post(url, body).toPromise().then(r => {
          this.addToken(r["access_token"]);
          return 200;
      }).catch((error)=>{
          if(error.status===0) {
              return 500;
          }
          return error.status;
      });
  }

  attemptGoogleLogin(){
      const app = initializeApp(this.firebaseConfig);
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      return signInWithPopup(auth, provider)
          .then((result) => {
              // The signed-in user info.
              const user = result.user;
              const displayName = user.displayName;
              const firstName = displayName.substring(0, displayName.indexOf(" "));
              const lastName = displayName.substring(displayName.indexOf(" ")+1, displayName.length);
              const url = "http://localhost:3000/user/googleLogin";
              const body = {
                  email: user.email,
                  accessToken: user["accessToken"],
                  firstName: firstName,
                  lastName: lastName
              };
              return this.http.post(url, body).toPromise().then(r => {
                  this.addToken(r["access_token"]);
                  return 200;
              }).catch((error)=>{
                  if(error.status===0) {
                      return 500;
                  }
                  console.log("About to throw error.status");
                  return error.status;
              });
          }).catch((error) =>
              // Handle Errors here.
              error.code
          );
  }

  /**
   * Attempt to register a new User.
   *
   * @param firstName
   * @param lastName
   * @param email
   * @param password
   * @param accountType
   */
  async attemptSignUp(firstName: string, lastName: string, email: string, password: string, accountType: string): Promise<number>{
      const url ="http://localhost:3000/user/signUp";
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


      const body = { //Object to be saved into DB
          user: {
              firstName: firstName,
              lastName: lastName,
              email: email,
              userType: accountType,
              password: password
          }
      };

      return this.http.post(url, body).toPromise().then(r => 201).catch((error)=>{
          if(error.status===0) {
              return 500;
          }
          return error.status;
      });
  }

  /**
   * Get the details of the current User from the token in local storage
   */
  async obtainUserDetails(): Promise<string>{
      const url ="http://localhost:3000/user/getUserDetails";

      return this.http.get(url).toPromise().then(r=>r).catch((error)=>error);
  }

  /**
   * Attempt to update the User details through means of the token in local storage
   *
   * @param firstName
   * @param lastName
   * @param birthDate
   */
  async attemptUpdateUserDetails(firstName: string, lastName: string, birthDate: string): Promise<any>{
      const user = {
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: birthDate
      };
      const url = "http://localhost:3000/user/updateUserDetail";
      return this.http.put(url, user).toPromise().then(r=>200).catch((error)=>{
          if(error.status===401) {
              return 401;
          } else {
              return 500;
          }
      });

  }
}


