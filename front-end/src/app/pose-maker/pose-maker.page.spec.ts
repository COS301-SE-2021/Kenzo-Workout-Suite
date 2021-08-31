import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {AlertController, IonicModule} from "@ionic/angular";

import { PoseMakerPage } from "./pose-maker.page";
import {RouterTestingModule} from "@angular/router/testing";
import {IonicStorageModule} from "@ionic/storage-angular";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

describe("PoseMakerPage", () => {
    let component: PoseMakerPage;
    let fixture: ComponentFixture<PoseMakerPage>;
    let routeMock: Router;
    let alertController: AlertController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ PoseMakerPage ],
            imports: [IonicModule.forRoot(), RouterTestingModule, FormsModule, IonicStorageModule.forRoot()]
        }).compileComponents();
        routeMock = TestBed.inject(Router);
        alertController = TestBed.inject(AlertController);
        fixture = TestBed.createComponent(PoseMakerPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });


});
