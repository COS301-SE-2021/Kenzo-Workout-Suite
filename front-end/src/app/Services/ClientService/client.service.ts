import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Client} from "../../Models/client";

@Injectable({
    providedIn: "root"
})
export class ClientService {

    constructor(private http: HttpClient) { }

    /**
     * This function gets the list of all clients associated with a planner
     *
     * @author Luca Azmanov, u19004185
     */
    async getClientList(){
        const url = "http://localhost:3000/client-contact/getAllPlannersContacts";
        return this.http.get(url).toPromise().then(data=>{
            data = {
                status: 200,
                data: data
            };
            return data;
        }).catch(err=>err);
    }

    /**
     * This function accepts a client object in order to add the client to the planner's list.
     *
     * @author Luca Azmanov, u19004185
     */
    async addClient(client: Client): Promise<number> {
        const url = "http://localhost:3000/client-contact/createClientContact";
        const body = {
            contactEmail: client.email,
            name: client.firstName,
            surname: client.lastName
        };
        console.log(body);
        return this.http.post(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /**
     * Deletes a client contact given the client ID
     *
     * @author Luca Azmanov, u19004185
     */
    async removeClient(){

    }

    /**
     * Updates client's credentials based on client object provided.
     *
     * @author Luca Azmanov, u19004185
     */
    async updateClient(){

    }
}
