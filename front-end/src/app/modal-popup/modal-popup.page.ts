import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ClientService } from "../Services/ClientService/client.service";
import {Client} from "../Models/client";

@Component({
    selector: "app-modal-popup",
    templateUrl: "./modal-popup.page.html",
    styleUrls: ["./modal-popup.page.scss"],
})
export class ModalPopupPage implements OnInit {
    private _contacts;
    private _contactsOriginal: Client[];
    private _submittedContacts: Client[];

    private _name = "";
    private _surname = "";
    private _email = "";
    private _contactID = "";
    private _isChecked = false;

    constructor(private modalController: ModalController, private clientService: ClientService) { }

    ngOnInit() {
        this.loadClients();
    }

    async loadClients(){
        const resp = await this.clientService.getClientList();
        const data = resp.data;
        this._contacts = new Array();
        this._contactsOriginal = new Array();
        for (let i = 0; i <data.length; i++) {
            this._name = data[i].name;
            this._surname = data[i].surname;
            this._email = data[i].contactEmail;
            this._contactID = data[i].contactId;
            this._isChecked = false;
            this._contacts[i] = {
                name: this._name,
                surname: this._surname,
                email: this._email,
                contactID: this._contactID,
                isChecked: this._isChecked};
            this._contactsOriginal[i] = new Client(this._name, this._surname, this._email, this._contactID);
        }
    }

    /**
     * Submit the selected contacts
     *
     * @author Jia Hui Wang u18080449
     */
    async submitModal(){
        let contactsCounter = 0;
        for (let i = 0; i <this._contacts.length; i++) {
            if (this._contacts[i]._isChecked){
                this._submittedContacts[contactsCounter] = this._contactsOriginal[i];
                contactsCounter++;
            }
        }
        if (contactsCounter === 0){
            alert("You need to select contacts or cancel if you wish to cancel the operation. ");
        }else if (contactsCounter === this._contacts.length){
            return "Submit all";
        }else{
            return this._submittedContacts;
        }
    }

    /**
     * Cancelling the contact selection
     *
     * @author Jia Hui Wang u18080449
     */
    async cancelModal(){
        await this.modalController.dismiss("Cancelled");
    }

    /**
     * Function to select all the contacts in the list if the top button is clicked, or deselect all of them
     *
     * @author Jia Hui Wang, u18080449
     */
    selectAllContacts(){
        const allCheck = document.getElementById("contactsCbx");
        const allContacts = document.getElementsByClassName("contactSelection");
        if (!(allCheck as HTMLIonCheckboxElement).checked){
            for (let i = 0; i <this._contacts.length; i++) {
                this._contacts[i]._isChecked = true;
                const thisContact = allContacts.item(i) as HTMLIonCheckboxElement;
                thisContact.checked = true;
                thisContact.disabled = true;
            }
        }else{
            for (let i = 0; i <this._contacts.length; i++) {
                this._contacts[i]._isChecked = false;
                const thisContact = allContacts.item(i) as HTMLIonCheckboxElement;
                thisContact.checked = false;
                thisContact.disabled = false;
            }
        }
    }
}
