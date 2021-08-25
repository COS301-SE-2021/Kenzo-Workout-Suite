import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { YourWorkoutsPage } from "./your-workouts.page";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {IonicStorageModule} from "@ionic/storage-angular";


describe("YourWorkoutsPage", () => {
    let component: YourWorkoutsPage;
    let fixture: ComponentFixture<YourWorkoutsPage>;
    let service: WorkoutService;


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ YourWorkoutsPage ],
            imports: [
                IonicModule.forRoot(),
                HttpClientTestingModule,
                RouterTestingModule,
                FormsModule,
                IonicStorageModule.forRoot()
            ]
        }).compileComponents();

        service = TestBed.inject(WorkoutService);
        fixture = TestBed.createComponent(YourWorkoutsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    //Your workouts interface testing

    it("should, given an empty database, fail to obtain workouts for a planner with a given ID.", async () => {
        spyOn(service, "attemptGetWorkoutsByPlanner").and.resolveTo({status: 404});
        await component.loadWorkouts().then(error=>{
            expect(error).toEqual(404);
        });
    });

    it("should fail to get the workouts with a specific planner ID as server is not responding.", async () => {
    //spyOn(userService, 'attemptSignIn').and.stub();
        spyOn(service, "attemptGetWorkoutsByPlanner").and.resolveTo({status:500});
        await component.loadWorkouts().catch(error=>{
            expect(error).toEqual(500);
        });
    });

    it("should successfully obtain all workouts for a planner with a specific ID.", async () => {
        spyOn(service, "attemptGetWorkoutsByPlanner").and.resolveTo({status: 200, data:[]});
        await component.loadWorkouts().then(data=>{
            expect(data).toEqual(200);
        });
    });

    it("should, given an empty database, fail to obtain exercises.", async () => {
        spyOn(service, "attemptGetExercises").and.resolveTo({status: 404});
        spyOn(component, "loadWorkouts").and.resolveTo(404);
        await component.loadExercises().then(error=>{
            expect(error).toEqual(404);
        });
    });

    it("should fail to get the exercises as server is not responding.", async () => {
        //spyOn(userService, 'attemptSignIn').and.stub();
        spyOn(service, "attemptGetExercises").and.resolveTo({status:500});
        spyOn(component, "loadWorkouts").and.resolveTo(500);
        await component.loadExercises().catch(error=>{
            expect(error).toEqual(500);
        });
    });

    it("should successfully obtain all exercises.", async () => {
        spyOn(service, "attemptGetExercises").and.resolveTo({status: 200, data:[]});
        spyOn(component, "loadWorkouts").and.resolveTo(200);
        await component.loadExercises().then(data=>{
            expect(data).toEqual(200);
        });
    });

    it("should, given a data-store where the pdf of the workout doesn't exist, fail to obtain the PDF of the workout.", async () => {
        spyOn(service, "attemptGetPDF").and.resolveTo({status: 404});
        spyOn(component, "presentAlert").and.stub();
        spyOn(component, "presentActionSheet").and.stub();
        await component.sharePDF(" ").then(error=>{
            expect(error).toEqual(404);
        });
    });

    it("should fail to obtain the PDF of the workout as the server is not responding.", async () => {
        spyOn(service, "attemptGetPDF").and.resolveTo({status: 500});
        spyOn(component, "presentAlert").and.stub();
        spyOn(component, "presentActionSheet").and.stub();
        await component.sharePDF(" ").then(error=>{
            expect(error).toEqual(500);
        });
    });

    it("should, given a data-store where the pdf of the workout does exist, obtain the PDF of the workout.", async () => {
        spyOn(service, "attemptGetPDF").and.resolveTo({status: 200});
        spyOn(component, "presentAlert").and.stub();
        spyOn(component, "presentActionSheet").and.stub();
        await component.sharePDF(" ").then(error=>{
            expect(error).toEqual(200);
        });
    });


});
