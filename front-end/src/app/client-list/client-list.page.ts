import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {Client} from "../Models/client";

@Component({
    selector: "app-client-list",
    templateUrl: "./client-list.page.html",
    styleUrls: ["./client-list.page.scss"],
})
export class ClientListPage implements OnInit {

    public contacts: Client[];

    constructor(private router: Router) {
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
        this.contacts = new Array();
        for (let i = 0; i <15; i++) {
            this.contacts[i] = new Client("Luca", "IsABeast", "lucaisabeast@gmail.com");
        }
    }

    /**
     * Displays a form to fill in to create a contact
     *
     * @author Luca Azmanov, u19004185
     */
    createContact() {

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
