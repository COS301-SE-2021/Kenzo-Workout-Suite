import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {IonicModule} from "@ionic/angular";

import { ModalPopupPage } from "./modal-popup.page";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe("ModalPopupPage", () => {
    let component: ModalPopupPage;
    let fixture: ComponentFixture<ModalPopupPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ ModalPopupPage ],
            imports: [
                IonicModule.forRoot(),
                HttpClientTestingModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ModalPopupPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
