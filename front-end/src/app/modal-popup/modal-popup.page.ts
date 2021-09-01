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

    private _name = "";
    private _surname = "";
    private _email = "";
    private _contactID = "";
    private _isChecked = false;

    constructor(private modalController: ModalController, private clientService: ClientService) { }

    ngOnInit() {
        this.loadClients();
    }

    async submitModal(){

    }

    async cancelModal(){
        await this.modalController.dismiss();
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

    segmentChanged($event: any) {
        if ($event.detail.value === "all"){

        }else if ($event.detail.value === "select"){

        }else{

        }
    }
}
