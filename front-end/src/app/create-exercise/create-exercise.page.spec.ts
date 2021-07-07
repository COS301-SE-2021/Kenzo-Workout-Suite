import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {AlertController, IonicModule} from '@ionic/angular';

import { CreateExercisePage } from './create-exercise.page';
import {Router} from "@angular/router";
import {WorkoutService} from "../Services/WorkoutService/workout.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import {IonicStorageModule} from "@ionic/storage-angular";

describe('CreateExercisePage', () => {
  let component: CreateExercisePage;
  let fixture: ComponentFixture<CreateExercisePage>;
  let service : WorkoutService;
  let alertController:AlertController;
  let routeMock:Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExercisePage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, RouterTestingModule, FormsModule, IonicStorageModule.forRoot()]
    }).compileComponents();

    routeMock = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController);
    service = TestBed.inject(WorkoutService);
    fixture = TestBed.createComponent(CreateExercisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Create Exercise Unit Testing
  it('should, given incorrect data, fail to create an exercise.', async () => {
    spyOn(service, 'attemptSubmitExercise').and.resolveTo(400);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    await component.createExercise().catch(error=>{
      expect(error).toEqual(new Error('Data is invalid.'));
    });
  });
  it('should fail to create exercise as server is not responding.', async () => {
    spyOn(service, 'attemptSubmitExercise').and.resolveTo(500);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    await component.createExercise().catch(error=>{
      expect(error).toEqual(new Error('Server is not responding.'));
    });
  });
  it('should successfully create exercise with valid data.', async () => {
    spyOn(service, 'attemptSubmitExercise').and.resolveTo(200);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    spyOn(routeMock, "navigate").and.resolveTo();
    spyOn(component,"reloadWindow").and.stub();
    await component.createExercise().then(data=>{
      expect(data).toEqual(200);
    });
  });
});
