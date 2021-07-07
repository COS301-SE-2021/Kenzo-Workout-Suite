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

  it('should sign in User successfully and return a 200 status',async () => {

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

  it('should fail to sign in User because credentials are incorrect and return a 400 status',async () => {

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

  it('should fail to sign in User because server is not responding and return a 500 status',async () => {

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

    let respStatus = service.attemptSignUp("Portal", "Bot", "thecake@isfake.com" ,"Potato@123","PLANNER");

    const body: Object = { //Object to be saved into DB
      user: {
        "firstName": "Portal",
        "lastName": "Bot",
        "email": "thecake@isfake.com",
        "userType": "PLANNER",
        "password": "Potato@123"
      }
    }

    const req = httpMock.expectOne("http://localhost:3000/user/signUp");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    let resp = new HttpResponse({
      status: 200,
      statusText: 'Created planner',
      body: {"message": "Client created"}
    });
    req.flush(resp);

    let status = await respStatus;
    expect(status).toEqual(201);
  });

  it('should fail to sign up planner because credentials are incorrect and return a 400 status',async () => {

    let respStatus = service.attemptSignUp("Jackster", "Wang","luca@me.com","Potat","PLANNER");
    const body: Object = { //Object to be saved into DB
      user: {
        "firstName": "Jackster",
        "lastName": "Wang",
        "email": "luca@me.com",
        "userType": "PLANNER",
        "password": "Potat"
      }
    }
    const req = httpMock.expectOne("http://localhost:3000/user/signUp");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    let error = new HttpErrorResponse({
      status: 400,
      statusText: "Bad request, invalid details"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(400);
  });

  it('should fail to sign up planner because email is already registered and return a 400 status',async () => {

    let respStatus = service.attemptSignUp("Jackie", "Wang","j@j.com","Jackie@123","PLANNER");
    const body: Object = { //Object to be saved into DB
      user: {
        "firstName": "Jackie",
        "lastName": "Wang",
        "email": "j@j.com",
        "userType": "PLANNER",
        "password": "Jackie@123"
      }
    }
    const req = httpMock.expectOne("http://localhost:3000/user/signUp");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    let error = new HttpErrorResponse({
      status: 400,
      statusText: "Bad request, already existent planner email"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(400);
  });

  it('should fail to sign up planner because server is not responding and return a 500 status',async () => {

    let respStatus = service.attemptSignUp("Zelealem", "Wang","luca@me.com","Potat@123","PLANNER");

    const body: Object = { //Object to be saved into DB
      user: {
        "firstName": "Zelealem",
        "lastName": "Wang",
        "email": "luca@me.com",
        "userType": "PLANNER",
        "password": "Potat@123"
      }
    }
    const req = httpMock.expectOne("http://localhost:3000/user/signUp");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    let error = new HttpErrorResponse({
      status: 500,
      statusText: "Server not responding"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(500);
  });

  it('should sign up client successfully and return a 200 status',async () => {

    let respStatus = service.attemptSignUp("League","Legends","League@Legends.com","League@123","CLIENT");

    const body: Object = { //Object to be saved into DB
      user: {
        "firstName": "League",
        "lastName": "Legends",
        "email": "League@Legends.com",
        "userType": "CLIENT",
        "password": "League@123"
      }
    }

    const req = httpMock.expectOne("http://localhost:3000/user/signUp");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    let resp = new HttpResponse({
      status: 200,
      statusText: 'Created client',
      body: {"message": "Planner Authentication successful"}
    });
    req.flush(resp);

    let status = await respStatus;
    expect(status).toEqual(201);
  });

  it('should fail to sign up client because credentials are incorrect and return a 400 status',async () => {

    let respStatus = service.attemptSignUp("Jackster", "Wang","luca@me.com","Potat","CLIENT");
    const body: Object = { //Object to be saved into DB
      user: {
        "firstName": "Jackster",
        "lastName": "Wang",
        "email": "luca@me.com",
        "userType": "CLIENT",
        "password": "Potat"
      }
    }
    const req = httpMock.expectOne("http://localhost:3000/user/signUp");
    let error = new HttpErrorResponse({
      status: 400,
      statusText: "Bad request, invalid details"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(400);
  });

  it('should fail to sign up client because email is already registered and return a 400 status',async () => {
    let respStatus = service.attemptSignUp("Jackie", "Wang","j@j.com","Jackie@123","CLIENT");
    const body: Object = { //Object to be saved into DB
      user: {
        "firstName": "Jackie",
        "lastName": "Wang",
        "email": "j@j.com",
        "userType": "CLIENT",
        "password": "Jackie@123"
      }
    }
    const req = httpMock.expectOne("http://localhost:3000/user/signUp");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    let error = new HttpErrorResponse({
      status: 400,
      statusText: "Bad request, already existent client email"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(400);
  });

  it('should fail to sign up client because server is not responding and return a 500 status',async () => {

    let respStatus = service.attemptSignUp("Zelealem", "Wang","luca@me.com","Potat@123","CLIENT");

    const body: Object = { //Object to be saved into DB
      user: {
        "firstName": "Zelealem",
        "lastName": "Wang",
        "email": "luca@me.com",
        "userType": "CLIENT",
        "password": "Potat@123"
      }
    }
    const req = httpMock.expectOne("http://localhost:3000/user/signUp");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    let error = new HttpErrorResponse({
      status: 500,
      statusText: "Server not responding"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(500);
  });

});
