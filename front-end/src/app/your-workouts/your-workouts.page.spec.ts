import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertController, IonicModule } from '@ionic/angular';

import { YourWorkoutsPage } from './your-workouts.page';
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {IonicStorageModule} from "@ionic/storage-angular";
import { UserService } from "../Services/UserService/user.service"

describe('YourWorkoutsPage', () => {
  let component: YourWorkoutsPage;
  let fixture: ComponentFixture<YourWorkoutsPage>;
  let service : WorkoutService;
  let alertController:AlertController;
  let routeMock:Router;
  let userService : UserService;

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
    alertController = TestBed.inject(AlertController);
    routeMock = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
    fixture = TestBed.createComponent(YourWorkoutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Your workouts interface testing

  it('should, given an empty database, fail to obtain workouts for a planner with a given ID.', async () => {
    spyOn(service, 'attemptGetWorkoutsByPlanner').and.resolveTo({"status": 404});
    await component.loadWorkouts().then(error=>{
      expect(error).toEqual(404);
    });
  });

  it('should fail to get the workouts with a specific planner ID as server is not responding.', async () => {
    //spyOn(userService, 'attemptSignIn').and.stub();
    spyOn(service, 'attemptGetWorkoutsByPlanner').and.resolveTo({"status":500});
    await component.loadWorkouts().catch(error=>{
      expect(error).toEqual(500);
    });
  });

  it('should successfully obtain all workouts for a planner with a specific ID.', async () => {
    spyOn(service, 'attemptGetWorkouts').and.resolveTo({"status": 200});
    await component.loadWorkouts().then(data=>{
      expect(data).toEqual(200);
    });
  });

  it('should, given an empty database, fail to obtain exercises for a planner with a given ID.', async () => {
    // spyOn(userService, 'attemptSignIn').and.stub();
    // spyOn(userService, 'addToken').and.stub();
    // spyOn(userService, "getToken").and.stub();
    spyOn(service, 'attemptGetExercisesByPlanner').and.resolveTo({"status": 404});
    await component.loadWorkouts().catch(error=>{
      expect(error).toEqual(404);
    });
  });

  it('should fail to get the exercises with a specific planner ID as server is not responding.', async () => {
    //spyOn(userService, 'attemptSignIn').and.stub();
    spyOn(service, 'attemptGetExercisesByPlanner').and.resolveTo({"status":500});
    await component.loadWorkouts().catch(error=>{
      expect(error).toEqual(500);
    });
  });

  it('should successfully obtain all exercises for a planner with a specific ID..', async () => {
    spyOn(service, 'attemptGetExercisesByPlanner').and.resolveTo({"status": 200});
    await component.loadWorkouts().then(data=>{
      expect(data).toEqual(200);
    });
  });
});
