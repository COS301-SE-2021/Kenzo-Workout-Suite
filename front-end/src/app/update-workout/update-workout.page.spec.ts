import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {AlertController, IonicModule} from '@ionic/angular';

import { UpdateWorkoutPage } from './update-workout.page';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {IonicStorageModule} from "@ionic/storage-angular";
import {Router} from "@angular/router";
import {WorkoutService} from "../Services/WorkoutService/workout.service";

describe('UpdateWorkoutPage', () => {
  let component: UpdateWorkoutPage;
  let fixture: ComponentFixture<UpdateWorkoutPage>;
  let service : WorkoutService;
  let alertController:AlertController;
  let routeMock:Router;
  let router:Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateWorkoutPage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, RouterTestingModule, FormsModule, IonicStorageModule.forRoot()],
      // providers: [ {provide: Router, useClass: RouterStub}]
    }).compileComponents();
  }));

  beforeEach(() => {
    routeMock = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController);
    service = TestBed.inject(WorkoutService);
    router = TestBed.get(Router);
    spyOn(router, 'getCurrentNavigation').and.returnValue({ extras: { state: { id: 'valid_id'} } } as any);
    fixture = TestBed.createComponent(UpdateWorkoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Updates Workout Unit Testing
  it('should, given incorrect data, fail to update an workout.', async () => {
    spyOn(service, 'attemptUpdateWorkout').and.resolveTo(400);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    await component.submitUpdateRequest().catch(error=>{
      expect(error).toEqual(new Error('Data is invalid.'));
    });
  });
  it('should fail to update workout as server is not responding.', async () => {
    spyOn(service, 'attemptUpdateWorkout').and.resolveTo(500);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    await component.submitUpdateRequest().catch(error=>{
      expect(error).toEqual(new Error('Server is not responding.'));
    });
  });
  it('should successfully update workout with valid data.', async () => {
    spyOn(service, 'attemptUpdateWorkout').and.resolveTo(200);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    spyOn(routeMock, "navigate").and.resolveTo();
    spyOn(component,"reloadWindow").and.stub();
    await component.submitUpdateRequest().then(data=>{
      expect(data).toEqual(200);
    });
  });

});
