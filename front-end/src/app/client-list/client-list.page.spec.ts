import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { ClientListPage } from "./client-list.page";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

describe("ClientListPage", () => {
    let component: ClientListPage;
    let fixture: ComponentFixture<ClientListPage>;
    let routeMock: Router;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ ClientListPage ],
            imports: [IonicModule.forRoot(), RouterTestingModule]
        }).compileComponents();
        routeMock = TestBed.inject(Router);

        fixture = TestBed.createComponent(ClientListPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
