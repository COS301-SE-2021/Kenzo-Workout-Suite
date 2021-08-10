import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {AlertController, IonicModule} from "@ionic/angular";
import { UpdateExercisePage } from "./update-exercise.page";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Router} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {IonicStorageModule} from "@ionic/storage-angular";

describe("UpdateExercisePage", () => {
    let component: UpdateExercisePage;
    let fixture: ComponentFixture<UpdateExercisePage>;
    let service: WorkoutService;
    let alertController: AlertController;
    let routeMock: Router;
    let router: Router;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ UpdateExercisePage ],
            imports: [IonicModule.forRoot(), HttpClientTestingModule, RouterTestingModule, FormsModule, IonicStorageModule.forRoot()],
        }).compileComponents();
    }));

    beforeEach(() => {
        routeMock = TestBed.inject(Router);
        alertController = TestBed.inject(AlertController);
        service = TestBed.inject(WorkoutService);
        router = TestBed.get(Router);
        spyOn(router, "getCurrentNavigation").and.returnValue({ extras: { state: { exercise: "valid_id"} } } as any);
        fixture = TestBed.createComponent(UpdateExercisePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    // Updates Exercise Unit Testing
    it("should, given incorrect data, fail to update an exercise.", async () => {
        spyOn(service, "attemptUpdateExercise").and.resolveTo(400);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        await component.submitUpdateRequest().catch(error=>{
            expect(error).toEqual(new Error("Data is invalid."));
        });
    });
    it("should fail to update exercise as server is not responding.", async () => {
        spyOn(service, "attemptUpdateExercise").and.resolveTo(500);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        await component.submitUpdateRequest().catch(error=>{
            expect(error).toEqual(new Error("Server is not responding."));
        });
    });
    it("should successfully update exercise with valid data.", async () => {
        spyOn(service, "attemptUpdateExercise").and.resolveTo(200);
        spyOn(alertController, "create").and.stub();
        spyOn(component, "presentAlert").and.stub();
        spyOn(routeMock, "navigate").and.resolveTo();
        spyOn(component, "reloadWindow").and.stub();
        await component.submitUpdateRequest().then(data=>{
            expect(data).toEqual(200);
        });
    });

});
