import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {AlertController, IonicModule} from "@ionic/angular";

import { ClientListPage } from "./client-list.page";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {IonicStorageModule} from "@ionic/storage-angular";

describe("ClientListPage", () => {
    let component: ClientListPage;
    let fixture: ComponentFixture<ClientListPage>;
    let routeMock: Router;
    let alertController: AlertController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ ClientListPage ],
            imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientTestingModule]
        }).compileComponents();
        routeMock = TestBed.inject(Router);
        alertController = TestBed.inject(AlertController);

        fixture = TestBed.createComponent(ClientListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
