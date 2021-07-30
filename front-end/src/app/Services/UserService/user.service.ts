import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Storage } from "@ionic/storage";

import {root} from "rxjs/internal-compatibility";

@Injectable({
    providedIn: "root"
})
export class UserService {


    constructor(private http: HttpClient, private storage: Storage) {
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
    async attemptUpdateUserDetails(firstName: string, lastName: string, birthDate: Date): Promise<any>{
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


