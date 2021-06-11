import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

import { UserService } from './user.service';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";

describe('UserServiceService', () => {
  let service: UserService;
  let httpMock:HttpTestingController;
  let httpClient:HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
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

  it('should sign in user successfully and return a 200 status',async () => {

    let respStatus = service.attemptSignIn("luca@me.com", "Test123!");

    const req = httpMock.expectOne("http://localhost:5500/user/signIn");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"email": "luca@me.com", "password": "Test123!"});

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

    const req = httpMock.expectOne("http://localhost:5500/user/signIn");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"email": "luca@me.com", "password": "Test123!"});

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

    const req = httpMock.expectOne("http://localhost:5500/user/signIn");
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({"email": "luca@me.com", "password": "Test123!"});

    let error = new HttpErrorResponse({
      status: 500,
      statusText: "Bad request"
    });

    req.flush(null,error);

    let status = await respStatus;
    expect(status).toEqual(500);
  });
});
