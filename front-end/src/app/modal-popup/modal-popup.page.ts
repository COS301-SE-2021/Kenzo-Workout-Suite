import { Component, OnInit, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
    selector: "app-modal-popup",
    templateUrl: "./modal-popup.page.html",
    styleUrls: ["./modal-popup.page.scss"],
})
export class ModalPopupPage implements OnInit {

    constructor(private modalController: ModalController) { }

    ngOnInit() {
    }

    async closeModal(){
        await this.modalController.dismiss();
    }

}
