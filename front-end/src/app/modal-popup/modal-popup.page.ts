import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { ClientService } from "../Services/ClientService/client.service";
import { Contact } from "../Models/contact";

@Component({
    selector: "app-modal-popup",
    templateUrl: "./modal-popup.page.html",
    styleUrls: ["./modal-popup.page.scss"],
})
export class ModalPopupPage implements OnInit {
    private _contacts;
    private _contactsOriginal: Contact[];
    private _submittedContacts: Contact[];

    private name = "";
    private surname = "";
    private contactEmail = "";
    private contactID = "";
    private isChecked = false;
    private plannerID = "";

    constructor(private modalController: ModalController, private clientService: ClientService) { }

    ngOnInit() {
        this.loadClients();
    }

    async loadClients(){
        const resp = await this.clientService.getClientList();
        console.log(resp);
        const data = resp.data;
        this._contacts = new Array();
        this._contactsOriginal = new Array();
        for (let i = 0; i <data.length; i++) {
            this.name = data[i].name;
            this.surname = data[i].surname;
            this.contactEmail = data[i].contactEmail;
            this.contactID = data[i].contactId;
            this.plannerID = data[i].plannerID;
            this.isChecked = false;
            this._contacts[i] = {
                contactID: this.contactID,
                contactEmail: this.contactEmail,
                name: this.name,
                surname: this.surname,
                plannerID: this.plannerID
            };
            this._contactsOriginal[i] = new Contact(this.contactID, this.contactEmail, this.name, this.surname, this.plannerID);
            /*this._contactsOriginal[i] = {
                contactId: this.contactID,
                contactEmail: this.contactEmail,
                name: this.name,
                surname: this.surname,
                plannerID: this.plannerID
            };*/
        }
    }

    /**
     * Submit the selected contacts
     *
     * @author Jia Hui Wang u18080449
     */
    async submitModal(){
        let contactsCounter = 0;
        this._submittedContacts = new Array();
        for (let i = 0; i <this._contacts.length; i++) {
            if (this._contacts[i].isChecked){
                this._submittedContacts[contactsCounter] = this._contactsOriginal[i];
                contactsCounter++;
            }
        }
        if (contactsCounter === 0){
            alert("You need to select contacts or cancel if you wish to cancel the operation. ");
        }else if (contactsCounter === this._contacts.length){
            await this.modalController.dismiss("Submit all");
        }else{
            await this.modalController.dismiss(this._submittedContacts);
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
                const thisContact = allContacts.item(i) as HTMLIonCheckboxElement;
                thisContact.checked = true;
                thisContact.disabled = true;
            }
        }else{
            for (let i = 0; i <this._contacts.length; i++) {
                const thisContact = allContacts.item(i) as HTMLIonCheckboxElement;
                thisContact.checked = false;
                thisContact.disabled = false;
            }
        }
    }
}
