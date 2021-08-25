import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {AlertController, IonicModule} from "@ionic/angular";
import { SignUpPage } from "./sign-up.page";
import {UserService} from "../Services/UserService/user.service";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {IonicStorageModule} from "@ionic/storage-angular";

describe("SignUpPage", () => {
    let component: SignUpPage;
    let fixture: ComponentFixture<SignUpPage>;
    let service: UserService;
    let alertController: AlertController;
    let routeMock: Router;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ SignUpPage ],
            imports: [
                IonicModule.forRoot(),
                HttpClientTestingModule,
                RouterTestingModule,
                FormsModule,
                IonicStorageModule.forRoot()
            ]
        }).compileComponents();

        service = TestBed.inject(UserService);
        alertController = TestBed.inject(AlertController);
        routeMock = TestBed.inject(Router);
        fixture = TestBed.createComponent(SignUpPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    //Sign up Interface Unit Testing

    it("should, given an incorrect email and password, fail to sign up an account.", async () => {
        spyOn(service, "attemptSignUp").and.resolveTo(400);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        await component.signUp().then(error=>{
            expect(error).toEqual(new Error("User credentials are incorrect."));
        });
    });

    it("should fail to sign up an account as server is not responding.", async () => {
        spyOn(service, "attemptSignUp").and.resolveTo(500);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        await component.signUp().then(error=>{
            expect(error).toEqual(new Error("Server is not responding."));
        });
    });
    it("should successfully sign up an account with valid details.", async () => {
        spyOn(service, "attemptSignUp").and.resolveTo(200);
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        await component.signUp().then(data=>{
            expect(data).toEqual(200);
        });
    });
});
