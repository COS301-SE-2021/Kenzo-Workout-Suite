import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertController, IonicModule } from '@ionic/angular';

import { YourWorkoutsPage } from './your-workouts.page';
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {UserService} from "../Services/UserService/user.service";

describe('YourWorkoutsPage', () => {
  let component: YourWorkoutsPage;
  let fixture: ComponentFixture<YourWorkoutsPage>;
  let service : WorkoutService;
  let alertController:AlertController;
  let routeMock:Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YourWorkoutsPage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, RouterTestingModule, FormsModule]
    }).compileComponents();

    service = TestBed.inject(WorkoutService);
    alertController = TestBed.inject(AlertController);
    routeMock = TestBed.inject(Router);
    fixture = TestBed.createComponent(YourWorkoutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Your workouts interface testing

  it('should, given an empty database, fail to obtain data.', async () => {
    spyOn(service, 'attemptGetWorkouts').and.resolveTo({"message": "No workouts obtained"});
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    await component.LoadWorkouts().catch(error=>{
      expect(error).toEqual(new Error('Workouts do not exist.'));
    });
  });

  it('should fail to get the workouts as server is not responding.', async () => {
    spyOn(service, 'attemptGetWorkouts').and.resolveTo(500);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    await component.LoadWorkouts().catch(error=>{
      expect(error).toEqual(new Error('Server is not responding.'));
    });
  });
  it('should successfully obtain all workouts.', async () => {
    spyOn(service, 'attemptGetWorkouts').and.resolveTo({"message": "Successfully retrieved workouts"});
    spyOn(routeMock, "navigate").and.resolveTo();
    await component.LoadWorkouts().then(data=>{
      expect(data).toEqual(200);
    });
  });
});
