import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {AlertController, IonicModule} from '@ionic/angular';

import { ProfilePage } from './profile.page';
import {IonicStorageModule} from "@ionic/storage-angular";
import { UserService } from "../Services/UserService/user.service"
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let alertController:AlertController;
  let userService : UserService;
  let httpMock: HttpTestingController;
  let routeMock:Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePage ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        IonicStorageModule.forRoot()
      ]
    }).compileComponents();

    alertController = TestBed.inject(AlertController);
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    routeMock = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fail to update User details for the currently logged in planner as server is not responding.', async () => {
    spyOn(userService, 'attemptUpdateUserDetails').and.resolveTo(500);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    spyOn(component,"reloadWindow").and.stub();
    await component.updateDetails().then(error=>{
      expect(error).toEqual(500);
    });
  });

  it('should fail to update User details for the planner as currently logged on person is not authorized .', async () => {
    spyOn(userService, 'attemptUpdateUserDetails').and.resolveTo(401);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    spyOn(component,"reloadWindow").and.stub();
    await component.updateDetails().catch(error=>{
      expect(error).toEqual(401);
    });
  });

  it('should successfully obtain all workouts for a planner with a specific ID.', async () => {
    spyOn(userService, 'attemptUpdateUserDetails').and.resolveTo(200);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    spyOn(component,"reloadWindow").and.stub();
    await component.updateDetails().then(data=>{
      expect(data).toEqual(200);
    });
  });


});
