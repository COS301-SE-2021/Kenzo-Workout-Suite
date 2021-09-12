import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule} from "@ionic/angular";

import { SearchPage } from "./search.page";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {IonicStorageModule} from "@ionic/storage-angular";

describe("SearchPage", () => {
    let component: SearchPage;
    let fixture: ComponentFixture<SearchPage>;
    let service: WorkoutService;


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ SearchPage ],
            imports: [
                IonicModule.forRoot(),
                HttpClientTestingModule,
                RouterTestingModule,
                FormsModule,
                IonicStorageModule.forRoot()
            ]
        }).compileComponents();

        service = TestBed.inject(WorkoutService);
        fixture = TestBed.createComponent(SearchPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should, given an empty database, fail to obtain all exercises.", async () => {
        spyOn(service, "attemptGetExercisesByPlanner").and.resolveTo({status: 404});
        await component.loadExercises().catch(error=>{
            expect(error).toEqual(404);
        });
    });

    it("should fail to get all exercises as server is not responding.", async () => {
        spyOn(service, "attemptGetExercisesByPlanner").and.resolveTo(500);
        await component.loadExercises().catch(error=>{
            expect(error).toEqual(500);
        });
    });

    it("should successfully obtain all exercises.", async () => {
        spyOn(service, "attemptGetExercisesByPlanner").and.resolveTo({status: 200, data:[]});
        await component.loadExercises().then(data=>{
            expect(data).toEqual(200);
        });
    });

});
