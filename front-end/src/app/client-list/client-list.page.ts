import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {Client} from "../Models/client";
import {ClientService} from "../Services/ClientService/client.service";

@Component({
    selector: "app-client-list",
    templateUrl: "./client-list.page.html",
    styleUrls: ["./client-list.page.scss"],
})
export class ClientListPage implements OnInit {

    public contacts: Client[];

    name = "";
    surname = "";
    email = "";

    constructor(private router: Router, private clientService: ClientService) {
        this.getClients();
    }

    ngOnInit() {
    }

    /**
     * This function queries the user service to retrieve a list of clients for the logged in planner.
     *
     * @author Luca Azmanov, u19004185
     */
    async getClients(){
        const resp = await this.clientService.getClientList();
        const data = resp.data;
        console.log(data);
        this.contacts = new Array();
        for (let i = 0; i <data.length; i++) {
            this.contacts[i] = new Client(data[i].name, data[i].surname, data[i].contactEmail);
        }
    }

    /**
     * Displays a form to fill in to create a contact
     *
     * @author Luca Azmanov, u19004185
     */
    createContact() {
        document.getElementById("create").style.display = "block";
        document.getElementById("list").style.display = "none";
    }

    /**
     * Returns planner to list of contacts
     *
     * @author Luca Azmanov, u19004185
     */
    cancel() {
        document.getElementById("create").style.display = "none";
        document.getElementById("list").style.display = "block";
    }

    /**
     * This function uses the user service to add a client to the planner's conact list
     *
     * @author Luca Azmanov, u19004185
     */
    async submitContact() {
        const client = new Client(this.name, this.surname, this.email);

        const resp = await this.clientService.addClient(client);
        console.log(resp);


    }

    async goToFYP(){
        await this.router.navigate(["/your-workouts"])
            .then(() => {
                window.location.reload();
            });
    }

    async goToProfile(){
        await this.router.navigate(["/profile"])
            .then(() => {
                window.location.reload();
            });
    }

    async goToSearch(){
        await this.router.navigate(["/search"])
            .then(() => {
                window.location.reload();
            });
    }
}
