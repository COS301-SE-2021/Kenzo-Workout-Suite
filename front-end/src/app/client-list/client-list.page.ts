import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {Client} from "../Models/client";
import {ClientService} from "../Services/ClientService/client.service";
import {AlertController} from "@ionic/angular";

@Component({
    selector: "app-client-list",
    templateUrl: "./client-list.page.html",
    styleUrls: ["./client-list.page.scss"],
})
export class ClientListPage implements OnInit {

    private _contacts: Client[];
    private _contactsOriginal: Client[];

    private _name = "";
    private _surname = "";
    private _email = "";
    private _contactID = "";

    constructor(private router: Router, private clientService: ClientService, private alertController: AlertController) {
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
        // console.log(data);
        this._contacts = new Array();
        this._contactsOriginal = new Array();
        for (let i = 0; i <data.length; i++) {
            this._contacts[i] = new Client(data[i].name, data[i].surname, data[i].contactEmail, data[i].contactId);
            this._contactsOriginal[i] = new Client(data[i].name, data[i].surname, data[i].contactEmail, data[i].contactId);
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
     * Displays a form to fill in to create a contact
     *
     * @param id is the contactID of the contact
     * @author Luca Azmanov, u19004185
     */
    editContact(id: string) {
        document.getElementById("edit").style.display = "block";
        document.getElementById("list").style.display = "none";
        document.getElementById("create").style.display = "none";

        for (let i = 0; i < this._contacts.length; i++) {
            if(this._contacts[i].contactID===id){
                this._name = this._contacts[i].firstName;
                this._surname = this._contacts[i].lastName;
                this._email = this._contacts[i].email;
                this._contactID = id;
                break;
            }
        }
    }

    /**
     * Returns planner to list of contacts
     *
     * @author Luca Azmanov, u19004185
     */
    cancel() {
        document.getElementById("create").style.display = "none";
        document.getElementById("edit").style.display = "none";
        document.getElementById("list").style.display = "block";
    }

    /**
     * This function uses the user service to add a client to the planner's contact list
     *
     * @author Luca Azmanov, u19004185
     */
    async submitContact() {
        const client = new Client(this._name, this._surname, this._email, "");

        const resp = await this.clientService.addClient(client);

        if(resp>=200 && resp<300){
            await this.router.navigate(["/client-list"])
                .then(() => {
                    this.reloadWindow();
                });
            return 200;
        } else if(resp>=400 && resp<500){
            const alert = await this.alertController.create({
                cssClass: "kenzo-alert",
                header: "Could not create contact",
                buttons: ["Dismiss"]
            });

            await this.presentAlert(alert);
            throw new Error("Data is invalid.");
        }else{
            // Server Error
            const alert = await this.alertController.create({
                cssClass: "kenzo-alert",
                header: "Server isn't responding",
                message: "Please try again later.",
                buttons: ["Dismiss"]
            });
            await this.presentAlert(alert);
            throw new Error("Server is not responding.");
        }
    }

    /**
     * This function uses the user service to update a client's credentials
     *
     * @author Luca Azmanov, u19004185
     */
    async update() {
        const client = new Client(this._name, this._surname, this._email, this._contactID);
        const status = await this.clientService.updateClient(client);
        if (status < 400) {
        // Success State
            this.router.navigate(["/client-list"]).then(()=>{
                this.reloadWindow();
            }
            );
            return 200;
        } else if(status>=400 && status<500){
        // Invalid Input
            const alert = await this.alertController.create({
                cssClass: "kenzo-alert",
                header: "Could not update contact",
                buttons: ["Dismiss"]
            });

            await this.presentAlert(alert);
            throw new Error("Data is invalid.");
        } else{
        // Server Error
            const alert = await this.alertController.create({
                cssClass: "kenzo-alert",
                header: "Server isn't responding",
                message: "Please try again later.",
                buttons: ["Dismiss"]
            });
            await this.presentAlert(alert);
            throw new Error("Server is not responding.");
        }
    }

    /**
     * This function uses the user service to remove a client
     *
     * @author Luca Azmanov, u19004185
     */
    async remove() {
        let confirmation = false;
        let alert = await this.alertController.create({
            cssClass: "kenzo-alert",
            header: "Are you sure you would like to delete this contact?",
            buttons: [{text:"Delete",
                handler: ()=>{
                    confirmation = true;
                }}, "Cancel"]
        });

        await this.presentAlert(alert);
        if(!confirmation) {
            return;
        }

        const status = await this.clientService.removeClient(this._contactID);
        console.log(" hi "+status);
        if (status < 300) {
        // Success State
            this.router.navigate(["/client-list"]).then(()=>{
                this.reloadWindow();
            }
            );
            return 200;
        } else if(status>=400 && status<500){
        // Invalid Input
            alert = await this.alertController.create({
                cssClass: "kenzo-alert",
                header: "Could not delete contact",
                message: "Please try again later.",
                buttons: ["Dismiss"]
            });

            await this.presentAlert(alert);
            throw new Error("Data is invalid.");
        } else{
        // Server Error
            alert = await this.alertController.create({
                cssClass: "kenzo-alert",
                header: "Server isn't responding",
                message: "Please try again later.",
                buttons: ["Dismiss"]
            });
            await this.presentAlert(alert);
            throw new Error("Server is not responding.");
        }
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

    /**
     * Helper Function to physically present alert to User independent of OS.
     *
     * @param alert
     * @author Luca Azmanov, u19004185
     */
    async presentAlert(alert: any) {
        await alert.present();
        await alert.onDidDismiss();
    }

    /**
     * This function is activated on a key press in the search bar.
     * The purpose is to present contacts that match the search requirements
     *
     * @author Luca Azmanov, u19004185
     */
    search(event) {
        this._contacts = this._contactsOriginal;
        const result = event.srcElement.value.trim().toLowerCase();
        const resultArray = new Array();
        if(result===""){
            return;
        }

        for (let i = 0; i < this._contacts.length; i++) {
            if(this._contacts[i].firstName.toLowerCase().trim().includes(result)){
                resultArray.push(this._contacts[i]);
                continue;
            }
            if(this._contacts[i].lastName.toLowerCase().trim().includes(result)){
                resultArray.push(this._contacts[i]);
                continue;
            }
            if(this._contacts[i].email.toLowerCase().trim().includes(result)){
                resultArray.push(this._contacts[i]);
            }
        }

        this._contacts = resultArray;

        if(this._contacts.length===0){ //no results
            document.getElementById("no-results").style.display = "block";
        }else {
            document.getElementById("no-results").style.display = "none";
        }
    }

    //Helper Functions
    reloadWindow(){
        window.location.reload();
    }

    get contacts(): Client[] {
        return this._contacts;
    }

    set contacts(value: Client[]) {
        this._contacts = value;
    }

    get contactsOriginal(): Client[] {
        return this._contactsOriginal;
    }

    set contactsOriginal(value: Client[]) {
        this._contactsOriginal = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get surname(): string {
        return this._surname;
    }

    set surname(value: string) {
        this._surname = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get contactID(): string {
        return this._contactID;
    }

    set contactID(value: string) {
        this._contactID = value;
    }
}
