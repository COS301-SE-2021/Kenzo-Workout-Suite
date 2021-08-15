import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {AlertController, IonicModule} from "@ionic/angular";

import { PoseMakerPage } from "./pose-maker.page";
import {RouterTestingModule} from "@angular/router/testing";
import {IonicStorageModule} from "@ionic/storage-angular";

describe("PoseMakerPage", () => {
    let component: PoseMakerPage;
    let fixture: ComponentFixture<PoseMakerPage>;
    let alertController: AlertController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ PoseMakerPage ],
            imports: [IonicModule.forRoot(), RouterTestingModule, IonicStorageModule.forRoot()]
        }).compileComponents();

        alertController = TestBed.inject(AlertController);
        fixture = TestBed.createComponent(PoseMakerPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
