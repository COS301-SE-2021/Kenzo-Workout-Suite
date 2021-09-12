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
     * @param client represents the details of the client being added
     * @return status is the code of the response
     * @author Luca Azmanov, u19004185
     */
    async addClient(client: Client): Promise<number> {
        const url = "http://localhost:3000/client-contact/createClientContact";
        const body = {
            contactEmail: client.email,
            name: client.firstName,
            surname: client.lastName
        };

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
     * @param id is the contactID
     * @return status is the code of the response
     * @author Luca Azmanov, u19004185
     */
    async removeClient(id: string){
        const url = "http://localhost:3000/client-contact/deleteClientContact";
        const body = {
            contactID:id,
        };
        return this.http.request("delete", url, {body}).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /**
     * Updates client's credentials based on client object provided.
     *
     * @param client is the client credentials used for updating
     * @return status is the code of the response
     * @author Luca Azmanov, u19004185
     */
    async updateClient(client: Client){
        const url = "http://localhost:3000/client-contact/updateClientContact";

        const body = {
            contactID: client.contactID,
            email: client.email,
            name: client.firstName,
            surname: client.lastName
        };

        return this.http.put(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /**
     * Send an email of the workout's PDF to all clients of the planner.
     *
     * @param workoutID is the id of the workout to get the pdf from
     * @return status is the code of the response
     * @author Jia Hui Wang, u18080449
     */
    async attemptEmailAllClientsPDF(workoutID: string): Promise<any>{
        const url = "http://localhost:3000/client-contact/sendEmailsPDFToAllContacts";
        const body = {
            workoutID: workoutID
        };
        return this.http.post(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /**
     * Send an email of the workout's video to all clients of the planner.
     *
     * @param workoutID is the id of the workout to get the pdf from
     * @return status is the code of the response
     * @author Jia Hui Wang, u18080449
     */
    async attemptEmailAllClientsVideo(workoutID: string): Promise<any>{
        const url = "http://localhost:3000/client-contact/sendEmailsVideoToAllContacts";
        const body = {
            workoutID: workoutID
        };
        return this.http.post(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /**
     * Send an email of the workout's PDF and video to all clients of the planner.
     *
     * @param workoutID is the id of the workout to get the pdf and video from
     * @return status is the code of the response
     * @author Jia Hui Wang, u18080449
     */
    async attemptEmailAllClientsMedia(workoutID: string): Promise<any>{
        const url = "http://localhost:3000/client-contact/sendEmailsMultimediaToAllContacts";
        const body = {
            workoutID: workoutID
        };
        return this.http.post(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /**
     * Send an email of the workout's PDF to selected clients of the planner.
     *
     * @param workoutID is the id of the workout to get the pdf from
     * @param clients is an array of the selected clients
     * @return status is the code of the response
     * @author Jia Hui Wang, u18080449
     */
    async attemptEmailClientsPDF(workoutID: string, contact: any[]): Promise<any>{
        const url = "http://localhost:3000/client-contact/sendEmailsPDFToContacts";
        const body = {
            contacts: contact,
            workoutID: workoutID,
        };
        return this.http.post(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /**
     * Send an email of the workout's video to selected clients of the planner.
     *
     * @param workoutID is the id of the workout to get the pdf from
     * @param clients is an array of the selected clients
     * @return status is the code of the response
     * @author Jia Hui Wang, u18080449
     */
    async attemptEmailClientsVideo(workoutID: string, contact: any[]): Promise<any>{
        const url = "http://localhost:3000/client-contact/sendEmailsVideoToContacts";
        const body = {
            contacts: contact,
            workoutID: workoutID,
        };
        return this.http.post(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }

    /**
     * Send an email of the workout's PDF and video to selected clients of the planner.
     *
     * @param workoutID is the id of the workout to get the pdf from
     * @param clients is an array of the selected clients
     * @return status is the code of the response
     * @author Jia Hui Wang, u18080449
     */
    async attemptEmailClientsMedia(workoutID: string, contact: any[]): Promise<any>{
        const url = "http://localhost:3000/client-contact/sendEmailsMultimediaToContacts";
        const body = {
            contacts: contact,
            workoutID: workoutID,
        };
        return this.http.post(url, body).toPromise().then(()=>200).catch(error=>{
            if(error.status===0) {
                return 500;
            }
            return error.status;
        });
    }
}
