import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class ClientService {

    constructor() { }

    /**
     * This function gets the list of all clients associated with a planner
     *
     * @author Luca Azmanov, u19004185
     */
    async getClientList(){

    }

    /**
     * This function accepts a client object in order to add the client to the planner's list.
     *
     * @author Luca Azmanov, u19004185
     */
    async addClient(){

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
