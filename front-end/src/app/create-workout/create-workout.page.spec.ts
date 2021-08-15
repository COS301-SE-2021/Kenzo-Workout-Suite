import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {AlertController, IonicModule} from "@ionic/angular";
import { CreateWorkoutPage } from "./create-workout.page";
import {Router} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {IonicStorageModule} from "@ionic/storage-angular";

describe("CreateWorkoutPage", () => {
    let component: CreateWorkoutPage;
    let fixture: ComponentFixture<CreateWorkoutPage>;
    let service: WorkoutService;
    let alertController: AlertController;
    let routeMock: Router;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ CreateWorkoutPage ],
            imports: [IonicModule.forRoot(), HttpClientTestingModule, RouterTestingModule, FormsModule, IonicStorageModule.forRoot()]
        }).compileComponents();

        routeMock = TestBed.inject(Router);
        alertController = TestBed.inject(AlertController);
        service = TestBed.inject(WorkoutService);
        fixture = TestBed.createComponent(CreateWorkoutPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    // Create Workout Unit Tests
    it("should, given incorrect data, fail to create a workout.", async () => {
        spyOn(service, "attemptSubmitWorkout").and.resolveTo(400);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "format").and.returnValue([]);
        spyOn(component, "presentAlert").and.stub();
        await component.submitCreateRequest().catch(error=>{
            expect(error).toEqual(new Error("Data is invalid."));
        });
    });
    it("should fail to create workout as server is not responding.", async () => {
        spyOn(service, "attemptSubmitWorkout").and.resolveTo(500);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "format").and.returnValue([]);
        spyOn(component, "presentAlert").and.stub();
        await component.submitCreateRequest().catch(error=>{
            expect(error).toEqual(new Error("Server is not responding."));
        });
    });
    it("should successfully create workout with valid data.", async () => {
        spyOn(service, "attemptSubmitWorkout").and.resolveTo(200);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "format").and.returnValue([]);
        spyOn(component, "reloadWindow").and.stub();
        await component.submitCreateRequest().then(data=>{
            expect(data).toEqual(200);
        });
    });
});
