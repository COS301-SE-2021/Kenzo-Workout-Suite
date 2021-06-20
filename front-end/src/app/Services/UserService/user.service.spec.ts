import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

import { UserService } from './user.service';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage-angular";

describe('UserServiceService', () => {
  let service: UserService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IonicStorageModule.forRoot()]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(()=>{
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Sign in testing

  it('should sign in user successfully and return a 200 status',async () => {

    let respStatus = service.attemptSignIn("luca@me.com", "Test123!");

    const req = httpMock.expectOne("http://localhost:3000/user/login");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"username": "luca@me.com", "password": "Test123!"});

    let resp = new HttpResponse({
      status: 200,
      statusText: 'Authorisation successful',
      body: {"message": "Planner Authentication successful"}
    });
    req.flush(resp);

    let status = await respStatus;
    expect(status).toEqual(200);
  });

  it('should fail to sign in user because credentials are incorrect and return a 400 status',async () => {

    let respStatus = service.attemptSignIn("luca@me.com", "Test123!");

    const req = httpMock.expectOne("http://localhost:3000/user/login");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"username": "luca@me.com", "password": "Test123!"});

    let error = new HttpErrorResponse({
      status: 400,
      statusText: "Bad request"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(400);
  });

  it('should fail to sign in user because server is not responding and return a 500 status',async () => {

    let respStatus = service.attemptSignIn("luca@me.com", "Test123!");

    const req = httpMock.expectOne("http://localhost:3000/user/login");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"username": "luca@me.com", "password": "Test123!"});

    let error = new HttpErrorResponse({
      status: 500,
      statusText: "Bad request"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(500);
  });

  // Sign up Testing

  it('should sign up planner successfully and return a 200 status',async () => {

    let respStatus = service.attemptSignUp("Portal", "Bot", "thecake@isfake.com" ,"Potato@123","Planner");

    const req = httpMock.expectOne("http://localhost:3000/user/signupPlanner");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"firstName":"Portal", "lastName":"Bot", "email": "thecake@isfake.com", "password": "Potato@123"});

    let resp = new HttpResponse({
      status: 200,
      statusText: 'Created planner',
      body: {"message": "Client created"}
    });
    req.flush(resp);

    let status = await respStatus;
    expect(status).toEqual(200);
  });

  it('should fail to sign up planner because credentials are incorrect and return a 400 status',async () => {

    let respStatus = service.attemptSignUp("Jackster", "Wang","luca@me.com","Potat","Planner");

    const req = httpMock.expectOne("http://localhost:3000/user/signupPlanner");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"firstName":"Jackster", "lastName":"Wang", "email": "luca@me.com", "password": "Potat"});

    let error = new HttpErrorResponse({
      status: 400,
      statusText: "Bad request, invalid details"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(400);
  });

  it('should fail to sign up planner because email is already registered and return a 400 status',async () => {

    let respStatus = service.attemptSignUp("Jackie", "Wang","jackiewang1999@outlook.com","Test@123","Planner");

    const req = httpMock.expectOne("http://localhost:3000/user/signupPlanner");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"firstName":"Jackie", "lastName":"Wang", "email": "jackiewang1999@outlook.com", "password": "Test@123"});

    let error = new HttpErrorResponse({
      status: 400,
      statusText: "Bad request, already existent planner email"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(400);
  });

  it('should fail to sign up planner because server is not responding and return a 500 status',async () => {

    let respStatus = service.attemptSignUp("Zelealem", "Wang","luca@me.com","Potat@123","Planner");

    const req = httpMock.expectOne("http://localhost:3000/user/signupPlanner");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"firstName":"Zelealem", "lastName":"Wang", "email": "luca@me.com", "password": "Potat@123"});

    let error = new HttpErrorResponse({
      status: 500,
      statusText: "Server not responding"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(500);
  });

  it('should sign up client successfully and return a 200 status',async () => {

    let respStatus = service.attemptSignUp("League","Legends","League@Legends.com","League@123","Client");

    const req = httpMock.expectOne("http://localhost:3000/user/signupClient");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"firstName":"League","lastName":"Legends","email": "League@Legends.com", "password": "League@123"});

    let resp = new HttpResponse({
      status: 200,
      statusText: 'Created client',
      body: {"message": "Planner Authentication successful"}
    });
    req.flush(resp);

    let status = await respStatus;
    expect(status).toEqual(200);
  });

  it('should fail to sign up client because credentials are incorrect and return a 400 status',async () => {

    let respStatus = service.attemptSignUp("Jackster", "Wang","luca@me.com","Potat","Client");

    const req = httpMock.expectOne("http://localhost:3000/user/signupClient");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"firstName":"Jackster", "lastName":"Wang", "email": "luca@me.com", "password": "Potat"});

    let error = new HttpErrorResponse({
      status: 400,
      statusText: "Bad request, invalid details"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(400);
  });

  it('should fail to sign up client because email is already registered and return a 400 status',async () => {

    let respStatus = service.attemptSignUp("Jaminda", "Maritz","jam@gmail.com","Test@123","Client");

    const req = httpMock.expectOne("http://localhost:3000/user/signupClient");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"firstName":"Jaminda", "lastName":"Maritz", "email": "jam@gmail.com", "password": "Test@123"});

    let error = new HttpErrorResponse({
      status: 400,
      statusText: "Bad request, already existent client email"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(400);
  });

  it('should fail to sign up client because server is not responding and return a 500 status',async () => {

    let respStatus = service.attemptSignUp("Zelealem", "Wang","luca@me.com","Potat@123","Client");

    const req = httpMock.expectOne("http://localhost:3000/user/signupClient");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"firstName":"Zelealem", "lastName":"Wang", "email": "luca@me.com", "password": "Potat@123"});

    let error = new HttpErrorResponse({
      status: 500,
      statusText: "Server not responding"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(500);
  });

});
