import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {AlertController, IonicModule} from '@ionic/angular';
import { SignInPage } from './sign-in.page';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {UserService} from "../Services/UserService/user.service";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {IonicStorageModule} from "@ionic/storage-angular";

describe('SignInPage', () => {
  let component: SignInPage;
  let fixture: ComponentFixture<SignInPage>;
  let service : UserService;
  let alertController:AlertController;
  let routeMock:Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInPage ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        IonicStorageModule.forRoot()
      ],
    }).compileComponents();

    routeMock = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController);
    service = TestBed.inject(UserService);
    fixture = TestBed.createComponent(SignInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Sign In Unit Tests
  it('should, given an incorrect email and password, fail to sign in an user.', async () => {
    spyOn(service, 'attemptSignIn').and.resolveTo(400);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    await component.signIn().catch(error=>{
      expect(error).toEqual(new Error('User credentials are incorrect.'));
    });
  });
  it('should fail to sign in an user as server is not responding.', async () => {
    spyOn(service, 'attemptSignIn').and.resolveTo(500);
    spyOn(alertController, "create").and.stub();
    spyOn(component, "presentAlert").and.stub();
    await component.signIn().catch(error=>{
      expect(error).toEqual(new Error('Server is not responding.'));
    });
  });
  it('should successfully sign in an user with valid credentials.', async () => {
    spyOn(service, 'attemptSignIn').and.resolveTo(200);
    spyOn(routeMock, "navigate").and.resolveTo();
    await component.signIn().then(data=>{
      expect(data).toEqual(200);
    });
  });
});

